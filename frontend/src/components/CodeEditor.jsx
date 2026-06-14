// Import React so we can build components
import React from 'react';
// Import the Editor component from the Monaco Editor library
import Editor from '@monaco-editor/react';

// This function creates our CodeEditor component.
// It takes 'code' (the current text), 'onChange' (function to run when typing), and 'language' (e.g. javascript)
function CodeEditor({ code, onChange, language }) {
  // We return the JSX (HTML-like syntax) to display the editor
  return (
    // This div gives the editor a container so we can style it
    <div className="code-editor-container" style={{ height: '400px', border: '1px solid #2e3748' }}>
      {/* 
        This is the Monaco Editor component.
        We set its height to 100%, pass the current language,
        set a dark theme ('vs-dark'), and pass the current code value.
        When the user types, the onChange function updates the code.
      */}
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value)}
      />
    </div>
  );
}

// Export the component so it can be used in other files like Home.jsx
export default CodeEditor;
