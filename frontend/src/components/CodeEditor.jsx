import React from 'react';

function CodeEditor({ code, onChange, language }) {
  return (
    <div className="code-editor-container">
      {/* Code Editor placeholder */}
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="editor-textarea"
        spellCheck="false"
      />
    </div>
  );
}

export default CodeEditor;
