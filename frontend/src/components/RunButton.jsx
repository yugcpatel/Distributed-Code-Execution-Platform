import React from 'react';

function RunButton({ onClick, loading }) {
  return (
    <button 
      onClick={onClick} 
      disabled={loading} 
      className={`run-button ${loading ? 'loading' : ''}`}
    >
      {loading ? 'Running...' : 'Run Code'}
    </button>
  );
}

export default RunButton;
