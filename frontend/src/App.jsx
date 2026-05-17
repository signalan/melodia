import { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [userText, setUserText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [playlistResult, setPlaylistResult] = useState(null);

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth`;
  };

  const handleGeneratePlaylist = async () => {
    if (!userText.trim()) {
      alert('Por favor, descreva o que você quer ouvir!');
      return;
    }

    setIsGenerating(true);
    setPlaylistResult(null);

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userText,
          accessToken,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setPlaylistResult(data);
    } catch (error) {
      alert(`Erro ao gerar playlist: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    let token = window.localStorage.getItem('token');

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    const handleTokenExchange = async () => {
      if (code) {
        const tokenResponse = await fetch(`${API_URL}/auth/token`, {
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
        }

        window.history.pushState('', document.title, window.location.pathname);
      } else if (token) {
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
                  <p>O link para a playlist aparece aqui assim que estiver pronta.</p>
                )}
                {isGenerating && (
                  <p>Gerando playlist...</p>
                )}
                {playlistResult && (
                  <div className="playlist-result">
                    <p>Playlist criada.</p>
                    <a
                      href={playlistResult.playlistUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="playlist-link"
                    >
                      Abrir no Spotify
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