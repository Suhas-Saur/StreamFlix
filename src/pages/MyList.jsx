import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';

const MyList = () => {
  const [myList, setMyList] = useState([]);

  const loadList = () => {
    const list = JSON.parse(localStorage.getItem('streamflix_mylist')) || [];
    setMyList(list);
  };

  useEffect(() => {
    loadList();

    // Listen to changes from within individual cards
    window.addEventListener('mylist_updated', loadList);
    return () => {
      window.removeEventListener('mylist_updated', loadList);
    };
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">My Watch List</h1>

      {myList.length === 0 ? (
        <div className="no-results" style={{ padding: '80px 0' }}>
          <h2>Your list is currently empty.</h2>
          <p style={{ color: '#808080', marginTop: '10px' }}>
            Click the "+" icon on any movie card or the "Add to My List" button on details pages to save titles here.
          </p>
        </div>
      ) : (
        <div className="movies-grid">
          {myList.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyList;
