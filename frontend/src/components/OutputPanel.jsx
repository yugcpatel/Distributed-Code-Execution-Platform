import React from 'react';

function OutputPanel({ output }) {
  return (
    <div className="output-panel">
      <h3>Terminal Output</h3>
      <div className="terminal-display">
        <pre>{output || 'No output to display. Run some code!'}</pre>
      </div>
    </div>
  );
}

export default OutputPanel;
