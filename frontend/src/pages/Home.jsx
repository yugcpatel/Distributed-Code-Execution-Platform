// Import React and hooks
import React, { useState, useEffect } from 'react';
// Import the resizable panel library (latest version uses Group and Separator)
import { Panel, Group, Separator } from 'react-resizable-panels';
// Import icons for our layout toggle buttons
import { Columns, Rows } from 'lucide-react';

// Import our custom components
import CodeEditor from '../components/CodeEditor';
import LanguageSelector from '../components/LanguageSelector';
import ThemeSelector from '../components/ThemeSelector';
import RunButton from '../components/RunButton';
import OutputPanel from '../components/OutputPanel';
import ConfirmModal from '../components/ConfirmModal';
import { executeCode } from '../services/api';

// Define the default starter code for each language
const DEFAULT_CODE = {
  javascript: '// Write your JavaScript code here\nconsole.log("Hello from SandBox!");',
  python: '# Write your Python code here\nprint("Hello from SandBox!")'
};

function Home() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(DEFAULT_CODE['python']);
  const [output, setOutput] = useState('');
  const [executionTime, setExecutionTime] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState(null);

  // New state variables for customizable UI
  const [layout, setLayout] = useState('horizontal'); // 'horizontal' (side-by-side) or 'vertical' (top-down)
  const [appTheme, setAppTheme] = useState('dark');   // 'dark', 'light', 'dracula'

  // When the theme changes, update the body attribute so CSS variables change instantly
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appTheme);
  }, [appTheme]);

  const handleLanguageChange = (newLanguage) => {
    const hasCustomCode = code !== DEFAULT_CODE[language] && code.trim() !== '';
    if (hasCustomCode) {
      setPendingLanguage(newLanguage);
      setShowModal(true);
      return;
    }
    setLanguage(newLanguage);
    setCode(DEFAULT_CODE[newLanguage]);
  };

  const confirmLanguageChange = () => {
    setLanguage(pendingLanguage);
    setCode(DEFAULT_CODE[pendingLanguage]);
    setShowModal(false);
  };

  const cancelLanguageChange = () => setShowModal(false);

  const handleRun = async () => {
    setLoading(true);
    setOutput('Running...');
    setExecutionTime(null);
    try {
      const result = await executeCode(code, language);
      setOutput(result.output || result.message || 'Execution finished.');
      setExecutionTime(result.executionTime);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page" style={{ padding: '20px', width: '100%', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      
      {/* Combined Top Bar: Logo, Language, Run, Theme, Layout */}
      <header className="top-bar" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        backgroundColor: 'var(--panel-bg)',
        padding: '12px 24px',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-glow, var(--shadow-sm))'
      }}>
        {/* Left Side: Logo */}
        <h1 style={{ margin: 0, fontSize: '24px', color: 'var(--accent-primary)', fontWeight: 'bold', letterSpacing: '0.5px' }}>SandBox</h1>
        
        {/* Center/Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* Action Group: Language and Run */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LanguageSelector language={language} onChange={handleLanguageChange} />
            <RunButton onClick={handleRun} loading={loading} />
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--border-color)' }}></div>

          {/* UI Controls Group: Theme and Orientation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <ThemeSelector theme={appTheme} onChange={setAppTheme} />
            
            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
              <button 
                onClick={() => setLayout('horizontal')}
                style={{ padding: '6px', backgroundColor: layout === 'horizontal' ? 'var(--bg-tertiary)' : 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                title="Side by Side"
              >
                <Columns size={18} />
              </button>
              <button 
                onClick={() => setLayout('vertical')}
                style={{ padding: '6px', backgroundColor: layout === 'vertical' ? 'var(--bg-tertiary)' : 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                title="Top and Bottom"
              >
                <Rows size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Resizable Workspace Area */}
      <div style={{ flex: 1, minHeight: 0, border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow-glow, none)' }}>
        <Group orientation={layout}>
          
          {/* Editor Panel */}
          <Panel defaultSize={50} minSize={20}>
            <CodeEditor code={code} onChange={setCode} language={language} appTheme={appTheme} />
          </Panel>

          {/* Draggable Divider */}
          <Separator className="resize-handle" />

          {/* Output Panel */}
          <Panel defaultSize={50} minSize={20}>
            <div style={{ height: '100%', backgroundColor: 'var(--panel-bg)' }}>
              <OutputPanel output={output} executionTime={executionTime} />
            </div>
          </Panel>
          
        </Group>
      </div>

      <ConfirmModal 
        isOpen={showModal} 
        message={`Switching to ${pendingLanguage} will clear your current code. Are you sure?`}
        onConfirm={confirmLanguageChange}
        onCancel={cancelLanguageChange}
      />
    </div>
  );
}

// Export the Home component to be used in App.jsx
export default Home;
