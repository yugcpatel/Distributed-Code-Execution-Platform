// Import React
import React from 'react';

// This function creates our OutputPanel component.
// It takes 'output' (the text returned from the backend) as a prop.
function OutputPanel({ output }) {
  return (
    // We give it a dark background and a border to look like a terminal console
    <div className="output-panel" style={{ background: '#1e1e1e', padding: '15px', borderRadius: '4px', marginTop: '20px', minHeight: '150px', border: '1px solid #333' }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#9cdcfe' }}>Terminal Output</h3>
      <div className="terminal-display">
        {/* We use a <pre> tag so that newlines and spacing in the output are preserved */}
        <pre style={{ margin: 0, color: '#d4d4d4', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          {/* If there is output, display it. Otherwise, show a default message. */}
          {output || 'No output to display. Run some code!'}
        </pre>
      </div>
    </div>
  );
}

// Export the component
export default OutputPanel;
