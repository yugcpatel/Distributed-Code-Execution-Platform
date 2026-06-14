// Import React and the useState hook for managing data over time
import React, { useState } from 'react';
// Import our custom components
import CodeEditor from '../components/CodeEditor';
import LanguageSelector from '../components/LanguageSelector';
import RunButton from '../components/RunButton';
import OutputPanel from '../components/OutputPanel';
// Import the API service we just updated
import { executeCode } from '../services/api';

function Home() {
  // State variables hold data that might change. When they change, React redraws the screen.
  // 'code' holds what the user typed in the editor
  const [code, setCode] = useState('// Write code here');
  // 'language' holds the currently selected language
  const [language, setLanguage] = useState('javascript');
  // 'output' holds the text returned from the server
  const [output, setOutput] = useState('');
  // 'loading' is true when we are waiting for the server to reply
  const [loading, setLoading] = useState(false);

  // This function is called when the user clicks 'Run Code'
  const handleRun = async () => {
    // Start loading so the button becomes disabled
    setLoading(true);
    // Clear the old output
    setOutput('Running...');
    
    try {
      // Call our API service
      const result = await executeCode(code, language);
      // Update the output panel with the result from the backend
      setOutput(result.output || result.message || 'Execution finished.');
    } catch (error) {
      // If there's an error, show it in the output panel
      setOutput(`Error: ${error.message}`);
    } finally {
      // Always stop loading, whether it succeeded or failed
      setLoading(false);
    }
  };

  return (
    <div className="home-page" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: '20px' }}>
        <h1>SandBox</h1>
      </header>
      
      <div className="workspace-grid">
        <div className="editor-section">
          {/* A control bar holding our language dropdown and run button */}
          <div className="control-bar" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <LanguageSelector language={language} onChange={setLanguage} />
            <RunButton onClick={handleRun} loading={loading} />
          </div>
          
          {/* The code editor component */}
          <CodeEditor code={code} onChange={setCode} language={language} />
        </div>
        
        <div className="output-section">
          {/* The output panel component */}
          <OutputPanel output={output} />
        </div>
      </div>
    </div>
  );
}

// Export the Home component to be used in App.jsx
export default Home;
