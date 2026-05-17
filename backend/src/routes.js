const express = require('express');
const { generatePlaylist } = require('./services/openai');
const { createSpotifyApi, getAccessToken, searchAndCreatePlaylist } = require('./services/spotify');

const router = express.Router();

router.get('/auth', (req, res) => {
    const scopes = 'playlist-modify-public playlist-modify-private user-library-read user-read-private user-read-email';

    res.redirect('https://accounts.spotify.com/authorize?' +
        'response_type=code' +
        '&client_id=' + process.env.SPOTIFY_CLIENT_ID +
        '&scope=' + encodeURIComponent(scopes) +
        '&redirect_uri=' + encodeURIComponent(process.env.REDIRECT_URI));
});

router.post('/auth/token', async (req, res) => {
    const { code } = req.body;

    try {
        const { accessToken, refreshToken } = await getAccessToken(code);
        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Authentication error.' });
    }
});

router.post('/generate', async (req, res) => {
    const { prompt, accessToken } = req.body;

    try {
        const spotifyApi = createSpotifyApi(accessToken);
        const tracks = await generatePlaylist(prompt);
        const playlist = await searchAndCreatePlaylist(spotifyApi, tracks, prompt);

        res.json({
            message: 'Playlist created successfully!',
            playlistId: playlist.id,
            playlistUrl: playlist.url,
        });

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send(error.message || 'An error occurred while creating the playlist. Please try again.');
    }
});

module.exports = router;