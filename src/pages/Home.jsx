import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { tmdbService } from '../services/tmdb';

const Home = () => {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    // Fetch trending to set the main Hero Banner movie
    tmdbService.fetchTrending()
      .then(movies => {
        if (isMounted) {
          if (movies && movies.length > 0) {
            // Select a random movie or the first movie from trending
            const randomIndex = Math.floor(Math.random() * Math.min(movies.length, 5));
            setFeaturedMovie(movies[randomIndex]);
          }
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error("Error setting featured movie:", err);
          setError("Failed to load home page content.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div style={{ paddingBottom: '50px' }}>
      {/* Featured Hero Banner */}
      <HeroBanner movie={featuredMovie} />

      {/* Categorized Horizontally Scrollable Movie Rows */}
      <div style={{ marginTop: '-80px', position: 'relative', zIndex: '10' }}>
        <MovieRow title="Trending Now" fetchAction={tmdbService.fetchTrending} />
        <MovieRow title="Popular Movies" fetchAction={tmdbService.fetchPopular} />
        <MovieRow title="Top Rated" fetchAction={tmdbService.fetchTopRated} />
        <MovieRow title="Action Blockbusters" fetchAction={tmdbService.fetchAction} />
        <MovieRow title="Adventure Quests" fetchAction={tmdbService.fetchAdventure} />
        <MovieRow title="Sci-Fi Fantasies" fetchAction={tmdbService.fetchSciFi} />
        <MovieRow title="Horror Chills" fetchAction={tmdbService.fetchHorror} />
        <MovieRow title="Animation Favorites" fetchAction={tmdbService.fetchAnimation} />
        <MovieRow title="Recently Added" fetchAction={tmdbService.fetchRecentlyAdded} />
      </div>
    </div>
  );
};

export default Home;
