// Import React
import React from 'react';

// This function creates our OutputPanel component.
// It takes 'output' and 'executionTime' as props.
function OutputPanel({ output, executionTime }) {
  return (
    // We use theme variables instead of hardcoded colors, and set height to 100%
    <div className="output-panel" style={{ height: '100%', boxSizing: 'border-box', padding: '15px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: '0', color: 'var(--accent-primary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Terminal Output</h3>
        
        {/* Render execution time conditionally if we have it */}
        {executionTime !== null && executionTime !== undefined && (
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Execution time: <span style={{ color: 'var(--text-primary)' }}>{executionTime}ms</span>
          </span>
        )}
      </div>
      
      <div className="terminal-display">
        {/* We use a <pre> tag so that newlines and spacing in the output are preserved */}
        <pre style={{ margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', fontSize: '14px' }}>
          {/* If there is output, display it. Otherwise, show a default message. */}
          {output || 'No output to display. Run some code!'}
        </pre>
      </div>
    </div>
  );
}

// Export the component
export default OutputPanel;
