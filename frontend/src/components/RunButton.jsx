// Import React
import React from 'react';

// This function creates the RunButton component.
// It takes 'onClick' (the function to call when clicked) and 'loading' (a boolean showing if code is currently running)
function RunButton({ onClick, loading }) {
  return (
    // We return a button element.
    // If 'loading' is true, we disable the button so the user can't click it multiple times.
    // We also set the onClick handler to the function passed in via props.
    <button 
      onClick={onClick} 
      disabled={loading} 
      className={`run-button ${loading ? 'loading' : ''}`}
      style={{
        padding: '8px 16px',
        backgroundColor: loading ? '#4b5563' : '#10b981', // Gray if loading, Green if ready
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: loading ? 'not-allowed' : 'pointer',
        marginLeft: '10px'
      }}
    >
      {/* If loading is true, display 'Running...', otherwise display 'Run Code' */}
      {loading ? 'Running...' : 'Run Code'}
    </button>
  );
}

// Export the component
export default RunButton;
