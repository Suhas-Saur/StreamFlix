import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, ThumbsUp, Download, ExternalLink } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import MoviePlayer from '../components/MoviePlayer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inList, setInList] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    tmdbService.getMovieDetails(id)
      .then(data => {
        if (isMounted) {
          if (data) {
            setMovie(data);
            
            // Check if in My List
            const list = JSON.parse(localStorage.getItem('streamflix_mylist')) || [];
            const exists = list.some(item => item.id === data.id);
            setInList(exists);
          } else {
            setError("Movie details could not be found.");
          }
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error("Error loading movie details:", err);
          setError("Failed to retrieve movie details.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleListToggle = () => {
    if (!movie) return;

    const list = JSON.parse(localStorage.getItem('streamflix_mylist')) || [];
    let updatedList;

    if (inList) {
      updatedList = list.filter(item => item.id !== movie.id);
    } else {
      updatedList = [...list, movie];
    }

    localStorage.setItem('streamflix_mylist', JSON.stringify(updatedList));
    setInList(!inList);
    window.dispatchEvent(new Event('mylist_updated'));
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  if (loading) return <LoadingSpinner />;
  if (error || !movie) return <ErrorMessage message={error || "Movie details not available."} />;

  return (
    <div className="watch-page">
      {/* Back Button */}
      <div className="back-btn-container">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {/* Video Player */}
      <MoviePlayer movie={movie} />

      {/* Movie Details Info */}
      <div className="watch-details-container">
        <div className="details-main">
          <h1 className="details-title">{movie.title}</h1>
          
          <div className="details-meta-row">
            <span className="rating-badge">{movie.rating} Rating</span>
            <span className="year-badge">{movie.year}</span>
            <span className="runtime-badge">{movie.runtime}</span>
            {movie.youtubeId && <span className="hero-badge">Trailer Available</span>}
            {movie.videoUrl && <span className="hero-badge" style={{ borderColor: '#46d369', color: '#46d369' }}>Free Full Movie</span>}
          </div>

          <p className="details-description">{movie.description}</p>

          <div className="details-action-buttons">
            {/* Add to List */}
            <button 
              className={`btn-action ${inList ? 'active' : ''}`} 
              onClick={handleListToggle}
            >
              {inList ? <Check size={18} /> : <Plus size={18} />}
              {inList ? "In My List" : "Add to My List"}
            </button>

            {/* Like */}
            <button 
              className={`btn-action ${isLiked ? 'active' : ''}`}
              onClick={handleLikeToggle}
            >
              <ThumbsUp size={18} fill={isLiked ? 'currentColor' : 'none'} />
              {isLiked ? "Liked" : "Like Title"}
            </button>

            {/* Download option */}
            {movie.videoUrl ? (
              <a 
                href={movie.videoUrl} 
                download={`${movie.title.replace(/\s+/g, '_')}.mp4`}
                className="btn-action btn-download"
                target="_blank"
                rel="noreferrer"
              >
                <Download size={18} /> Download Movie (Free)
              </a>
            ) : (
              movie.youtubeId && (
                <a 
                  href={`https://www.youtube.com/watch?v=${movie.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-action"
                  style={{ gap: '8px' }}
                >
                  <ExternalLink size={18} /> Watch on YouTube
                </a>
              )
            )}
          </div>
        </div>

        {/* Sidebar details */}
        <div className="details-sidebar">
          <div className="sidebar-section">
            <span className="sidebar-label">Cast</span>
            <span className="sidebar-value">
              {movie.cast && movie.cast.length > 0 
                ? movie.cast.join(', ') 
                : "No cast credits available."}
            </span>
          </div>

          <div className="sidebar-section">
            <span className="sidebar-label">Genres</span>
            <div style={{ marginTop: '5px' }}>
              {movie.genres && movie.genres.length > 0 ? (
                movie.genres.map((g, idx) => (
                  <span key={idx} className="genre-tag">
                    {typeof g === 'object' ? g.name : g}
                  </span>
                ))
              ) : (
                <span className="sidebar-value">No genre tags.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
