import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { tmdbService } from '../services/tmdb';

const Search = () => {
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  // Load trending recommendations if query is empty
  useEffect(() => {
    if (!query) {
      setLoading(true);
      tmdbService.fetchTrending()
        .then(data => {
          setTrending(data?.slice(0, 7) || []);
          setLoading(false);
        })
        .catch(err => {
          console.warn("Failed to load trending items in search page:", err);
          setLoading(false);
        });
    }
  }, [query]);

  // Execute search when query changes
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    // Add a slight debounce to avoid excessive API requests
    const delayDebounce = setTimeout(() => {
      tmdbService.searchMovies(query)
        .then(data => {
          if (isMounted) {
            setResults(data || []);
            setLoading(false);
          }
        })
        .catch(err => {
          if (isMounted) {
            console.error("Search error:", err);
            setError("Failed to fetch search results.");
            setLoading(false);
          }
        });
    }, 300);

    return () => {
      clearTimeout(delayDebounce);
      isMounted = false;
    };
  }, [query]);

  return (
    <div className="page-container">
      {query ? (
        <h1 className="page-title">Search Results for: <span style={{ color: '#ccc' }}>"{query}"</span></h1>
      ) : (
        <h1 className="page-title">Explore Trending Titles</h1>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : query && results.length === 0 ? (
        <div className="no-results">
          <h2>No matching titles found.</h2>
          <p style={{ color: '#808080', marginTop: '10px' }}>
            Try checking your spelling or search for alternative genres (e.g. Action, Horror, Animation).
          </p>
        </div>
      ) : query ? (
        <div className="movies-grid">
          {results.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        /* Recommended content when search query is empty */
        <div className="movies-grid">
          {trending.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
