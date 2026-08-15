import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { tmdbService } from '../services/tmdb';
import { movies as localMovies } from '../data/movies';

const GenresList = [
  { id: "all", name: "All Genres" },
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "27", name: "Horror" },
  { id: "878", name: "Sci-Fi" }
];

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();

  // Get if it's a TV Show route or Movie route
  const params = new URLSearchParams(location.search);
  const isTV = params.get("type") === "tv";

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadCategoryMovies = async () => {
      try {
        let results = [];
        if (selectedGenre === "all") {
          // Fetch a mix of popular and trending
          const popular = await tmdbService.fetchPopular();
          results = popular;
        } else {
          // Fetch by genre
          if (selectedGenre === "28") results = await tmdbService.fetchAction();
          else if (selectedGenre === "12") results = await tmdbService.fetchAdventure();
          else if (selectedGenre === "16") results = await tmdbService.fetchAnimation();
          else if (selectedGenre === "27") results = await tmdbService.fetchHorror();
          else if (selectedGenre === "878") results = await tmdbService.fetchSciFi();
        }

        if (isMounted) {
          // If TV Shows, we can simulate TV Shows by filtering/mapping items or sorting
          if (isTV) {
            // For mock/TMDB, just give them some TV-like titles or different listings
            setMovies(results.map(m => ({
              ...m,
              title: m.title.includes("Movie") ? m.title.replace("Movie", "Show") : `${m.title} (TV Series)`
            })));
          } else {
            setMovies(results);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error loading movies list:", err);
          setError("Failed to load catalog.");
          setLoading(false);
        }
      }
    };

    loadCategoryMovies();
  }, [selectedGenre, isTV]);

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          {isTV ? "TV Shows" : "Movies"}
        </h1>
        
        {/* Genre Selector */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          style={{
            backgroundColor: '#000',
            color: '#fff',
            border: '1px solid #fff',
            padding: '8px 15px',
            fontSize: '14px',
            borderRadius: '4px',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          {GenresList.map(g => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : movies.length === 0 ? (
        <div className="no-results">
          <h2>No titles found in this category.</h2>
        </div>
      ) : (
        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;
