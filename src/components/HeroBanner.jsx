import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';

const HeroBanner = ({ movie }) => {
  const navigate = useNavigate();

  if (!movie) return <div style={{ height: '40vh', background: '#000' }}></div>;

  const handlePlayClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <header className="hero-banner">
      <img
        src={movie.backdrop}
        alt={movie.title}
        className="hero-background"
      />
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <h1 className="hero-title">{movie.title}</h1>
        
        <div className="hero-meta">
          <Star size={16} fill="currentColor" className="hero-rating" />
          <span className="hero-rating">{movie.rating} Rating</span>
          <span>{movie.year}</span>
          {movie.runtime && <span>{movie.runtime}</span>}
          {movie.genres && movie.genres.length > 0 && (
            <span className="hero-badge">{movie.genres[0]}</span>
          )}
        </div>

        <p className="hero-description">
          {movie.description.length > 200
            ? `${movie.description.substring(0, 200)}...`
            : movie.description}
        </p>

        <div className="hero-buttons">
          <button className="btn btn-play" onClick={handlePlayClick}>
            <Play size={20} fill="currentColor" /> Play
          </button>
          <button className="btn btn-info" onClick={handlePlayClick}>
            <Info size={20} /> More Info
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeroBanner;
