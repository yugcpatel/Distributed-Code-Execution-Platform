import React, { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import LanguageSelector from '../components/LanguageSelector';
import RunButton from '../components/RunButton';
import OutputPanel from '../components/OutputPanel';

function Home() {
  const [code, setCode] = useState('// Write code here');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    // TODO: Implement actual execution flow
  };

  return (
    <div className="home-page">
      <header className="page-header">
        <h1>Distributed Code Runner</h1>
      </header>
      <div className="workspace-grid">
        <div className="editor-section">
          <div className="control-bar">
            <LanguageSelector language={language} onChange={setLanguage} />
            <RunButton onClick={handleRun} loading={loading} />
          </div>
          <CodeEditor code={code} onChange={setCode} language={language} />
        </div>
        <div className="output-section">
          <OutputPanel output={output} />
        </div>
      </div>
    </div>
  );
}

export default Home;
