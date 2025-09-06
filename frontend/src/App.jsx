import { useState, useEffect } from 'react'; // Importe useState e useEffect
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [userText, setUserText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [playlistResult, setPlaylistResult] = useState(null);

  // Lógica para lidar com o login
  const handleLogin = () => {
    // Redireciona o usuário para a rota de autenticação do back-end
    window.location.href = 'http://localhost:80/auth'; // Substitua pelo seu ngrok URL, se necessário
  };

  // Função para gerar a playlist
  const handleGeneratePlaylist = async () => {
    if (!userText.trim()) {
      alert('Por favor, descreva o que você quer ouvir!');
      return;
    }

    console.log('Enviando dados:', { prompt: userText, accessToken: accessToken });
    setIsGenerating(true);
    setPlaylistResult(null);

    try {
      const response = await fetch('http://localhost:80/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userText,
          accessToken: accessToken
        })
      });

      console.log('Status da resposta:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro do servidor:', errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Dados recebidos:', data);
      setPlaylistResult(data);
    } catch (error) {
      console.error('Erro completo:', error);
      alert(`Erro ao gerar playlist: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Analisa a URL para verificar se o token foi retornado
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');
    
    // Isso é para lidar com o retorno do nosso back-end
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    const handleTokenExchange = async () => {
      if (code) {
        // O back-end retornou um código, agora vamos trocar por um access token
        try {
          const tokenResponse = await fetch('http://localhost:80/auth/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code })
          });

          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            setAccessToken(tokenData.accessToken);
            window.localStorage.setItem('token', tokenData.accessToken);
            setIsAuthenticated(true);
            setShowForm(true);
          } else {
            console.error('Erro ao obter token');
          }
        } catch (error) {
          console.error('Erro na troca do código por token:', error);
        }

        // Limpa o código da URL para não aparecer para o usuário
        window.history.pushState('', document.title, window.location.pathname);
      } else if (token) {
        // Se já existe um token salvo, define como autenticado
        setIsAuthenticated(true);
        setShowForm(true);
        setAccessToken(token);
      }
    };

    handleTokenExchange();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <img src="/logo-melodia.png" alt="MelodIA Logo" className="logo" />
        <div className='logo-slogan'>
          <h1 className="title">MelodIA</h1>
          <p className="slogan">De uma ideia a uma playlist</p>
        </div>
      </header>

      <main className="main-content">
        <div className="card">
          <div className="card-section">
            <h3>Autentique-se para usar este serviço.</h3>
            {/* Renderização condicional do botão */}
            {isAuthenticated ? (
              <button className="btn authenticated">Autenticado!</button>
            ) : (
              <button className="btn" onClick={handleLogin}>Entrar com Spotify</button>
            )}
          </div>
          
          {showForm && (
            <>
              <div className="card-section">
                <h3>O que você quer ouvir?</h3>
                <textarea
                  placeholder="Escreva a ideia como veio em sua mente..."
                  className="textarea"
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                  disabled={isGenerating}
                ></textarea>
                <button 
                  className="btn" 
                  onClick={handleGeneratePlaylist}
                  disabled={isGenerating || !userText.trim()}
                >
                  {isGenerating ? 'Gerando...' : 'Gerar Playlist'}
                </button>
              </div>
              <div className="card-section">
                {!playlistResult && !isGenerating && (
                  <p>O link para a playlist será criado em instantes. Aproveite!</p>
                )}
                {isGenerating && (
                  <p>Criando sua playlist personalizada... ✨</p>
                )}
                {playlistResult && (
                  <div className="playlist-result">
                    <p>✅ {playlistResult.message}</p>
                    <a 
                      href={playlistResult.playlistUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="playlist-link"
                    >
                      🎵 Abrir Playlist no Spotify
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;