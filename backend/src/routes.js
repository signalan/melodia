const express = require('express');
const { generatePlaylist } = require('./services/openai');
const { createSpotifyApi, getAccessToken, searchAndCreatePlaylist } = require('./services/spotify');

const router = express.Router();

// Nova Rota para iniciar a autenticação
router.get('/auth', (req, res) => {
    const scopes = 'playlist-modify-public playlist-modify-private user-library-read user-read-private user-read-email';
    
    // O backend agora redireciona o usuário para o Spotify, usando o REDIRECT_URI
    // que aponta para o front-end
    res.redirect('https://accounts.spotify.com/authorize?' +
        'response_type=code' +
        '&client_id=' + process.env.SPOTIFY_CLIENT_ID +
        '&scope=' + encodeURIComponent(scopes) +
        '&redirect_uri=' + encodeURIComponent(process.env.REDIRECT_URI));
});

// Nova Rota para o front-end enviar o código e receber o access token
router.post('/auth/token', async (req, res) => {
    const { code } = req.body;

    try {
        const { accessToken, refreshToken } = await getAccessToken(code);
        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Erro ao obter o token de acesso:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro na autenticação.' });
    }
});

// A rota /generate permanece a mesma
router.post('/generate', async (req, res) => {
    const { prompt, accessToken } = req.body;

    try {
        const spotifyApi = createSpotifyApi(accessToken);
        const tracks = await generatePlaylist(prompt);
        
        console.log('Músicas geradas pelo ChatGPT:', tracks);
        const playlist = await searchAndCreatePlaylist(spotifyApi, tracks, prompt);

        res.json({
            message: 'Playlist criada com sucesso!',
            playlistId: playlist.id,
            playlistUrl: playlist.url,
        });

    } catch (error) {
        console.error('Erro completo:', error.response?.data || error.message);
        res.status(500).send(error.message || 'Ocorreu um erro ao criar a playlist. Tente novamente.');
    }
});

module.exports = router;