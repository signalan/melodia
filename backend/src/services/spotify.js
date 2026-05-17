const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');

const createSpotifyApi = (accessToken = null) => {
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: process.env.REDIRECT_URI,
    });

    if (accessToken) {
        spotifyApi.setAccessToken(accessToken);
    }

    return spotifyApi;
};

const getAccessToken = async (code) => {
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
        params: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    return {
        accessToken: tokenResponse.data.access_token,
        refreshToken: tokenResponse.data.refresh_token,
    };
};

const searchAndCreatePlaylist = async (spotifyApi, tracks, prompt) => {
    const trackUris = [];

    for (const track of tracks) {
        try {
            const searchResult = await spotifyApi.searchTracks(`${track.title} ${track.artist}`);
            if (searchResult.body.tracks.items.length > 0) {
                trackUris.push(searchResult.body.tracks.items[0].uri);
            }
        } catch (searchError) {
            console.error(searchError.message);
        }
    }

    if (trackUris.length === 0) {
        throw new Error('No tracks were found on Spotify based on your description.');
    }

    const playlistName = 'MelodIA';
    const newPlaylist = await spotifyApi.createPlaylist(playlistName, { 
        'public': false,
        'description': prompt 
    });
    await spotifyApi.addTracksToPlaylist(newPlaylist.body.id, trackUris);

    return {
        id: newPlaylist.body.id,
        url: newPlaylist.body.external_urls.spotify,
    };
};

module.exports = {
    createSpotifyApi,
    getAccessToken,
    searchAndCreatePlaylist,
};