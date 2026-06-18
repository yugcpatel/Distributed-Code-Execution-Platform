import React from 'react';
import { Play, Loader2 } from 'lucide-react';

function RunButton({ onClick, loading }) {
  return (
    <button 
      onClick={onClick} 
      disabled={loading} 
      className={`btn btn-primary ${loading ? 'animate-pulse-ring' : ''}`}
      style={{ minWidth: '120px' }}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="spinner" />
          Running...
        </>
      ) : (
        <>
          <Play size={16} fill="currentColor" />
          Run Code
        </>
      )}
    </button>
  );
}

export default RunButton;
