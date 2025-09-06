const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        message: 'Bem-vindo ao gerador de playlists!'
    });
});

app.use('/', routes);

module.exports = app;