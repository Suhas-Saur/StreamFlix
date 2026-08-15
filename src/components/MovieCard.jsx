import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Check, ThumbsUp } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [inList, setInList] = useState(false);

  // Check if movie is already in My List (localStorage)
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('streamflix_mylist')) || [];
    const exists = list.some(item => item.id === movie.id);
    setInList(exists);
  }, [movie.id]);

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    navigate(`/movie/${movie.id}`);
  };

  const handleListToggle = (e) => {
    e.stopPropagation();
    const list = JSON.parse(localStorage.getItem('streamflix_mylist')) || [];
    let updatedList;
    
    if (inList) {
      updatedList = list.filter(item => item.id !== movie.id);
    } else {
      updatedList = [...list, movie];
    }
    
    localStorage.setItem('streamflix_mylist', JSON.stringify(updatedList));
    setInList(!inList);

    // Dispatch a custom event to notify other components (like MyList page) that localStorage changed
    window.dispatchEvent(new Event('mylist_updated'));
  };

  // Safe fallback description
  const shortDesc = movie.description 
    ? (movie.description.length > 120 ? `${movie.description.substring(0, 120)}...` : movie.description)
    : "No description available.";

  // Safe fallback genres
  const genresList = Array.isArray(movie.genres) 
    ? movie.genres.slice(0, 3) 
    : [];

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <img
        src={movie.poster}
        alt={movie.title}
        className="card-poster"
        loading="lazy"
      />
      
      {/* Pop-out overlay on hover */}
      <div className="card-hover-details">
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          className="hover-backdrop"
        />
        
        <div className="hover-info">
          <div className="hover-buttons">
            <button 
              className="btn-circle btn-circle-play" 
              onClick={handlePlayClick}
              aria-label="Play Trailer"
            >
              <Play size={16} fill="currentColor" />
            </button>
            <button 
              className="btn-circle" 
              onClick={handleListToggle}
              aria-label={inList ? "Remove from List" : "Add to List"}
            >
              {inList ? <Check size={16} /> : <Plus size={16} />}
            </button>
            <button 
              className="btn-circle" 
              aria-label="Like"
              onClick={(e) => {
                e.stopPropagation();
                alert("Liked!");
              }}
            >
              <ThumbsUp size={14} />
            </button>
          </div>
          
          <div className="hover-title">{movie.title}</div>
          
          <div className="hover-meta">
            <span className="hover-rating">{movie.rating} Rating</span>
            <span>{movie.year}</span>
          </div>
          
          <div className="hover-desc">{shortDesc}</div>
          
          <div className="hover-genres">
            {genresList.map((g, idx) => (
              <span key={idx} className="genre-tag">
                {typeof g === 'object' ? g.name : g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
