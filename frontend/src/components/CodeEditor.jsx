// Import React so we can build components
import React from 'react';
// Import the Editor component from the Monaco Editor library
import Editor from '@monaco-editor/react';

function CodeEditor({ code, onChange, language, appTheme }) {
  // Map our app themes to Monaco Editor's built-in themes
  const monacoTheme = appTheme === 'light' ? 'light' : 'vs-dark';

  return (
    <div style={{ height: '100%', width: '100%', boxSizing: 'border-box' }}>
      <Editor
        height="100%"
        width="100%"
        language={language}
        theme={monacoTheme}
        value={code}
        onChange={(value) => onChange(value)}
        options={{
          minimap: { enabled: false }, // Turn off the minimap for a cleaner look
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      />
    </div>
  );
}

export default CodeEditor;
