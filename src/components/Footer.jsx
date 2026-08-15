import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <ul className="footer-links">
        <li><a href="#terms">Terms of Use</a></li>
        <li><a href="#privacy">Privacy Policy</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="#contact">Contact Us</a></li>
        <li><a href="#about">About StreamFlix</a></li>
      </ul>
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} StreamFlix Inc. All rights reserved. Fallback metadata powered by local mock data.
      </div>
    </footer>
  );
};

export default Footer;
