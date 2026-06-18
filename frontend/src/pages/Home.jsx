// Import React and hooks
import React, { useState, useEffect } from 'react';
// Import the resizable panel library
import { Panel, Group, Separator } from 'react-resizable-panels';
// Import icons
import { Columns, Rows, Code2, Play } from 'lucide-react';

// Import our custom components
import CodeEditor from '../components/CodeEditor';
import LanguageSelector from '../components/LanguageSelector';
import ThemeSelector from '../components/ThemeSelector';
import RunButton from '../components/RunButton';
import OutputPanel from '../components/OutputPanel';
import ConfirmModal from '../components/ConfirmModal';
import { executeCode, getJobStatus } from '../services/api';

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
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, waiting, running, completed, failed
  
  const [showModal, setShowModal] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState(null);

  const [layout, setLayout] = useState('horizontal');
  const [appTheme, setAppTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appTheme);
  }, [appTheme]);

  useEffect(() => {
    let intervalId;

    if (jobId) {
      intervalId = setInterval(async () => {
        try {
          const statusResult = await getJobStatus(jobId);
          const job = statusResult.job;
          const jobStatus = job?.status || 'failed';
          setStatus(jobStatus);
          
          if (jobStatus === 'waiting') {
            setOutput('Waiting in queue...');
          } else if (jobStatus === 'running') {
            setOutput('Running in sandbox...');
          } else if (jobStatus === 'completed') {
            setOutput(job?.output || 'Execution finished (no output).');
            setExecutionTime(job?.executionTime);
            setLoading(false);
            clearInterval(intervalId);
            setJobId(null);
          } else if (jobStatus === 'failed') {
            setOutput(`Execution failed:\n${job?.error || 'Unknown error occurred.'}`);
            setLoading(false);
            clearInterval(intervalId);
            setJobId(null);
          }
        } catch (err) {
          setStatus('failed');
          setOutput(`Error checking status: ${err.message}`);
          setLoading(false);
          clearInterval(intervalId);
          setJobId(null);
        }
      }, 200);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [jobId]);

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
    setStatus('waiting');
    setOutput('Submitting...');
    setExecutionTime(null);
    try {
      const result = await executeCode(code, language);
      setJobId(result.jobId);
    } catch (error) {
      setStatus('failed');
      setOutput(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ padding: '24px', gap: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Premium Glassmorphism Header */}
      <header className="glass-panel" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 24px',
        borderRadius: 'var(--radius-md)'
      }}>
        {/* Left Side: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', background: 'var(--accent-primary)', borderRadius: '8px', color: 'white', display: 'flex' }}>
            <Code2 size={24} />
          </div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px' }}>
            SandBox
          </h1>
        </div>
        
        {/* Center/Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          
          {/* Action Group: Language and Run */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LanguageSelector language={language} onChange={handleLanguageChange} />
            <RunButton onClick={handleRun} loading={loading} />
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--border-color)' }}></div>

          {/* UI Controls Group: Theme and Orientation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ThemeSelector theme={appTheme} onChange={setAppTheme} />
            
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <button 
                onClick={() => setLayout('horizontal')}
                className={`btn-icon ${layout === 'horizontal' ? 'active' : ''}`}
                style={{ borderRadius: 0, borderRight: '1px solid var(--border-color)' }}
                title="Side by Side"
              >
                <Columns size={18} />
              </button>
              <button 
                onClick={() => setLayout('vertical')}
                className={`btn-icon ${layout === 'vertical' ? 'active' : ''}`}
                style={{ borderRadius: 0 }}
                title="Top and Bottom"
              >
                <Rows size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Resizable Workspace Area */}
      <div className="glass-panel" style={{ flex: 1, minHeight: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <Group orientation={layout}>
          
          {/* Editor Panel */}
          <Panel defaultSize={50} minSize={20}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', background: 'rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {language === 'python' ? 'main.py' : 'index.js'}
                </span>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <CodeEditor code={code} onChange={setCode} language={language} appTheme={appTheme} />
              </div>
            </div>
          </Panel>

          {/* Draggable Divider */}
          <Separator className="resize-handle" />

          {/* Output Panel */}
          <Panel defaultSize={50} minSize={20}>
            <div style={{ height: '100%', backgroundColor: 'var(--bg-primary)' }}>
              <OutputPanel output={output} executionTime={executionTime} status={status} />
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

export default Home;
