import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-container">
      <h3 className="error-message">Oops! Something went wrong</h3>
      <p style={{ color: '#aaa', fontSize: '14px' }}>{message || "We had trouble connecting. Please try again."}</p>
    </div>
  );
};

export default ErrorMessage;
