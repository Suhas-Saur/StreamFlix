import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Bell } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  // Scroll listener to toggle solid background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update search query when URL changes (e.g. back navigation)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (location.pathname === "/search" && q) {
      setSearchQuery(q);
      setSearchActive(true);
    } else if (location.pathname !== "/search") {
      setSearchQuery("");
      setSearchActive(false);
    }
  }, [location]);

  const handleSearchToggle = () => {
    if (searchActive) {
      // If closing, clear search and navigate home
      setSearchQuery("");
      setSearchActive(false);
      if (location.pathname === "/search") {
        navigate("/");
      }
    } else {
      setSearchActive(true);
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 200);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    } else {
      navigate("/search");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isLinkActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-active' : ''}`}>
      <div className="nav-left">
        <Link to="/" className="logo" onClick={closeMobileMenu}>StreamFlix</Link>
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <ul className="nav-links">
          <li>
            <Link to="/" className={isLinkActive("/")} onClick={closeMobileMenu}>Home</Link>
          </li>
          <li>
            <Link to="/movies" className={isLinkActive("/movies")} onClick={closeMobileMenu}>Movies</Link>
          </li>
          <li>
            <Link to="/movies?type=tv" className={isLinkActive("/tv")} onClick={closeMobileMenu}>TV Shows</Link>
          </li>
          <li>
            <Link to="/search" className={isLinkActive("/search")} onClick={closeMobileMenu}>Trending</Link>
          </li>
          <li>
            <Link to="/mylist" className={isLinkActive("/mylist")} onClick={closeMobileMenu}>My List</Link>
          </li>
        </ul>
      </div>

      <div className="nav-right">
        <div className="search-container">
          <button className="search-icon-btn" onClick={handleSearchToggle} aria-label="Search Toggle">
            <Search size={20} />
          </button>
          <div className={`search-input-wrapper ${searchActive ? 'active' : ''}`}>
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Titles, people, genres..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <Bell size={20} style={{ cursor: 'pointer', color: '#fff' }} />

        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
          alt="Profile"
          className="profile-icon"
          onClick={() => navigate("/mylist")}
        />
      </div>
    </nav>
  );
};

export default Navbar;
