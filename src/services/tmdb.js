import { movies as localMovies } from '../data/movies';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Check if TMDB is configured
const isTMDBConfigured = () => {
  return API_KEY && API_KEY.trim() !== "" && API_KEY !== "YOUR_TMDB_API_KEY";
};

// Helper to format TMDB movie object to our app's structure
const formatMovie = (m) => {
  return {
    id: m.id,
    title: m.title || m.name || "Untitled Movie",
    description: m.overview || "No description available.",
    rating: m.vote_average ? parseFloat(m.vote_average.toFixed(1)) : 0,
    year: m.release_date ? new Date(m.release_date).getFullYear() : (m.first_air_date ? new Date(m.first_air_date).getFullYear() : 2025),
    poster: m.poster_path ? `${IMAGE_BASE_URL}/w500${m.poster_path}` : "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=80",
    backdrop: m.backdrop_path ? `${IMAGE_BASE_URL}/original${m.backdrop_path}` : "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    genres: m.genre_ids ? m.genre_ids : [],
    youtubeId: null // will be loaded on demand or fall back
  };
};

// Helper for local data categories
const getLocalByGenre = (genre) => {
  return localMovies.filter(m => m.genres.some(g => g.toLowerCase() === genre.toLowerCase()));
};

export const tmdbService = {
  // Fetch movie lists for rows
  getMoviesRow: async (endpoint, localCategory = "") => {
    if (!isTMDBConfigured()) {
      // Fallback: group mock data by category
      if (localCategory === "Trending Now") return localMovies.slice(0, 6);
      if (localCategory === "Popular Movies") return localMovies.slice(4, 10);
      if (localCategory === "Top Rated") return [...localMovies].sort((a, b) => b.rating - a.rating);
      if (localCategory === "Recently Added") return localMovies.filter(m => m.genres.includes("Recently Added")).concat(localMovies.slice(0, 2));
      return getLocalByGenre(localCategory).length > 0 ? getLocalByGenre(localCategory) : localMovies;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}&language=en-US`);
      if (!response.ok) throw new Error("TMDB API response error");
      const data = await response.json();
      return (data.results || []).map(formatMovie);
    } catch (error) {
      console.warn("TMDB error, falling back to local database:", error);
      // Fallback on error
      if (localCategory === "Trending Now") return localMovies.slice(0, 6);
      if (localCategory === "Popular Movies") return localMovies.slice(4, 10);
      if (localCategory === "Top Rated") return [...localMovies].sort((a, b) => b.rating - a.rating);
      return getLocalByGenre(localCategory).length > 0 ? getLocalByGenre(localCategory) : localMovies;
    }
  },

  // Main Page Rows endpoints mapping
  fetchTrending: () => tmdbService.getMoviesRow("/trending/movie/week", "Trending Now"),
  fetchPopular: () => tmdbService.getMoviesRow("/movie/popular", "Popular Movies"),
  fetchTopRated: () => tmdbService.getMoviesRow("/movie/top_rated", "Top Rated"),
  fetchAction: () => tmdbService.getMoviesRow("/discover/movie?with_genres=28", "Action"),
  fetchAdventure: () => tmdbService.getMoviesRow("/discover/movie?with_genres=12", "Adventure"),
  fetchSciFi: () => tmdbService.getMoviesRow("/discover/movie?with_genres=878", "Sci-Fi"),
  fetchHorror: () => tmdbService.getMoviesRow("/discover/movie?with_genres=27", "Horror"),
  fetchAnimation: () => tmdbService.getMoviesRow("/discover/movie?with_genres=16", "Animation"),
  fetchRecentlyAdded: () => tmdbService.getMoviesRow("/movie/now_playing", "Recently Added"),

  // Fetch movie details
  getMovieDetails: async (id) => {
    const numId = Number(id);
    // If it's a local movie ID
    const local = localMovies.find(m => m.id === numId);
    if (local) {
      return { ...local, cast: local.cast || [], runtime: local.runtime || "N/A" };
    }

    if (!isTMDBConfigured()) {
      return null;
    }

    try {
      const [detailsRes, creditsRes, videosRes] = await Promise.all([
        fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`),
        fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`),
        fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`)
      ]);

      if (!detailsRes.ok) throw new Error("Failed to fetch movie details");

      const detailsData = await detailsRes.json();
      const creditsData = creditsRes.ok ? await creditsRes.json() : { cast: [] };
      const videosData = videosRes.ok ? await videosRes.json() : { results: [] };

      // Find YouTube trailer
      const trailer = videosData.results?.find(
        vid => vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser")
      ) || videosData.results?.find(vid => vid.site === "YouTube");

      return {
        id: detailsData.id,
        title: detailsData.title || detailsData.name,
        description: detailsData.overview,
        rating: parseFloat(detailsData.vote_average.toFixed(1)),
        year: new Date(detailsData.release_date).getFullYear(),
        runtime: detailsData.runtime ? `${Math.floor(detailsData.runtime / 60)}h ${detailsData.runtime % 60}m` : "N/A",
        genres: detailsData.genres?.map(g => g.name) || [],
        cast: creditsData.cast?.slice(0, 5).map(c => `${c.name} (${c.character})`) || [],
        poster: detailsData.poster_path ? `${IMAGE_BASE_URL}/w500${detailsData.poster_path}` : "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=80",
        backdrop: detailsData.backdrop_path ? `${IMAGE_BASE_URL}/original${detailsData.backdrop_path}` : "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
        youtubeId: trailer ? trailer.key : null
      };
    } catch (error) {
      console.error("Error fetching details from TMDB:", error);
      // Failover search inside localMovies
      return localMovies.find(m => m.id === numId) || null;
    }
  },

  // Search movies
  searchMovies: async (query) => {
    if (!query || query.trim() === "") return [];

    if (!isTMDBConfigured()) {
      // Local search
      return localMovies.filter(m =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase()) ||
        m.genres.some(g => g.toLowerCase().includes(query.toLowerCase()))
      );
    }

    try {
      const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&include_adult=false`);
      if (!response.ok) throw new Error("Search API failure");
      const data = await response.json();
      return (data.results || []).map(formatMovie);
    } catch (error) {
      console.warn("Search TMDB failed, searching local movies:", error);
      return localMovies.filter(m =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
};
