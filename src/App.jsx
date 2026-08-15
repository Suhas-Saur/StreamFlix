import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Search from './pages/Search';
import MyList from './pages/MyList';
import Watch from './pages/Watch';

function App() {
  return (
    <Router>
      <div className="app">
        {/* Navigation Header */}
        <Navbar />
        
        {/* Routed Pages */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/search" element={<Search />} />
            <Route path="/mylist" element={<MyList />} />
            <Route path="/movie/:id" element={<Watch />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
