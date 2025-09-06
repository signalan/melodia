const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generatePlaylist = async (prompt) => {
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
            role: "user",
            content: `Olá, você é um DJ e recebeu a função de elaborar uma playlist a partir de um prompt de usuário que trará informações sobre a playlist que ele quer.

O usuário vai incluir no prompt qualquer ideia em sua mente e sua tarefa é transformá-lo em uma lista de músicas que reflita essa ideia.

Por exemplo, ele pode escrever sentimentos/humor/emoções/vibe que queira sentir, um ambiente/cenário que queira imaginar, um gênero que deseja escutar ou artistas/músicas que já gosta para ajudar em sua sugestão (mas não inclua apenas esses artistas/músicas, diversifique com suas sugestões próprias).

É importante que essas músicas sejam encontradas facilmente no Spotify, já que ela é sua ferramenta de trabalho.

Preciso que você formate a sua resposta como uma string de texto simples, com cada música e artista em uma nova linha, no formato '<música> - <artista>\n'. Siga estritamente esse formato, não adicione nenhum caractere a mais como numeração ou hífens ou aspas, pois será lido pela API do Spotify para criação da playlist. Não fuja do formato que eu lhe dei.

Dito isso, crie uma lista de 15 músicas e seus artistas com base na seguinte descrição de ideia no formato '<música> - <artista>\n': "${prompt}".`
        }],
    });

    const playlistText = chatCompletion.choices[0].message.content;
    
    const tracks = playlistText.split('\n')
        .map(track => track.trim())
        .filter(track => track !== '')
        .map(track => {
            const [title, artist] = track.split(' - ');
            return { title: title?.trim(), artist: artist?.trim() };
        })
        .filter(track => track.title && track.artist);

    return tracks;
};

module.exports = { generatePlaylist };