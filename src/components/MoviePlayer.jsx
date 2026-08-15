import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';

const MoviePlayer = ({ movie }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Reset states on movie change
  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [movie]);

  if (!movie) {
    return (
      <div className="video-player-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '15px' }}>
        <AlertTriangle size={48} color="#e50914" />
        <h3>No movie selected</h3>
        <button className="btn btn-play" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>
    );
  }

  const handleBackToMovies = () => {
    navigate('/');
  };

  // If there is no YouTube ID, render the fallback immediately
  if (!movie.youtubeId) {
    return (
      <div className="video-player-container" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#000', color: '#fff', textAlign: 'center', padding: '20px', gap: '20px'
      }}>
        <AlertTriangle size={48} color="#e50914" />
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Trailer unavailable</h2>
        <p style={{ color: '#aaa', maxWidth: '400px', fontSize: '14px' }}>
          We could not locate an official trailer for "{movie.title}".
        </p>
        <button 
          onClick={handleBackToMovies}
          className="btn btn-play"
          style={{ padding: '10px 20px', fontSize: '15px', borderRadius: '4px', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="video-player-container" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000' }}>
      {/* YouTube Player Iframe */}
      <iframe
        className="video-element"
        style={{ width: '100%', height: '100%', border: 'none' }}
        src={`https://www.youtube.com/embed/${movie.youtubeId}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0&enablejsapi=1`}
        title={`${movie.title} Trailer`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      ></iframe>

      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: '#000', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', zIndex: 10
        }}>
          <Loader2 className="spinner" size={40} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#aaa', marginTop: '10px', fontSize: '14px' }}>Loading trailer...</p>
        </div>
      )}

      {/* Playback Error Overlay */}
      {error && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.9)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', zIndex: 11, padding: '20px', textAlign: 'center', gap: '15px'
        }}>
          <AlertTriangle size={48} color="#e50914" />
          <h2 style={{ fontSize: '22px', fontWeight: 'bold' }}>Trailer unavailable</h2>
          <p style={{ color: '#aaa', fontSize: '14px' }}>
            The trailer could not be loaded. It may be restricted or blocked by YouTube.
          </p>
          <button 
            onClick={handleBackToMovies}
            className="btn btn-play"
            style={{ padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft size={16} /> Back to Movies
          </button>
        </div>
      )}
    </div>
  );
};

export default MoviePlayer;
