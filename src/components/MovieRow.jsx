import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';

const MovieRow = ({ title, fetchAction }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    fetchAction()
      .then(data => {
        if (isMounted) {
          setMovies(data || []);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error(`Error loading row "${title}":`, err);
          setError(err.message || "Failed to load movies");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fetchAction, title]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      // Scroll by 80% of the row width
      const scrollAmount = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      rowRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="movie-row">
        <h2 className="row-title">{title}</h2>
        <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || movies.length === 0) {
    // If there is an error, we don't crash, we just return empty row or minor message
    return null;
  }

  return (
    <div className="movie-row">
      <h2 className="row-title">{title}</h2>
      
      <div className="row-posters-wrapper">
        <button 
          className="row-arrow arrow-left" 
          onClick={() => handleScroll('left')}
          aria-label="Scroll Left"
        >
          <ChevronLeft size={30} />
        </button>
        
        <div className="row-posters" ref={rowRef}>
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        
        <button 
          className="row-arrow arrow-right" 
          onClick={() => handleScroll('right')}
          aria-label="Scroll Right"
        >
          <ChevronRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
