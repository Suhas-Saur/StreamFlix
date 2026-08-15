import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ color: '#aaa', fontSize: '14px', marginTop: '10px' }}>Loading StreamFlix...</p>
    </div>
  );
};

export default LoadingSpinner;
