// Import React so we can build components
import React from 'react';
// Import the Editor component from the Monaco Editor library
import Editor from '@monaco-editor/react';

// This function creates our CodeEditor component.
// It takes 'code' (the current text), 'onChange' (function to run when typing), 'language' (e.g. javascript), and 'appTheme'
function CodeEditor({ code, onChange, language, appTheme }) {
  // Map our app themes to Monaco Editor's built-in themes
  const monacoTheme = appTheme === 'light' ? 'light' : 'vs-dark';

  // We return the JSX (HTML-like syntax) to display the editor
  return (
    // This div gives the editor a container so we can style it.
    // We set height to 100% so it perfectly fills whatever container it's put in (like our resizable panels)
    <div className="code-editor-container" style={{ height: '100%', width: '100%', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}>
      {/* 
        This is the Monaco Editor component.
        We set its height to 100%, pass the current language,
        set the theme, and pass the current code value.
        When the user types, the onChange function updates the code.
      */}
      <Editor
        height="100%"
        width="100%"
        language={language}
        theme={monacoTheme}
        value={code}
        onChange={(value) => onChange(value)}
        options={{
          minimap: { enabled: false }, // Turn off the minimap for a cleaner look
          padding: { top: 16 }
        }}
      />
    </div>
  );
}

// Export the component so it can be used in other files like Home.jsx
export default CodeEditor;
