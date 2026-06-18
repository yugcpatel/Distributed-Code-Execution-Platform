import React from 'react';
import { Terminal, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

function OutputPanel({ output, executionTime, status }) {
  // Determine badge class based on status
  const getBadgeClass = () => {
    switch (status) {
      case 'waiting': return 'badge-waiting';
      case 'running': return 'badge-running';
      case 'completed': return 'badge-completed';
      case 'failed': return 'badge-failed';
      default: return 'badge-waiting';
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Terminal Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={16} color="var(--text-secondary)" />
          <h3 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>
            Console
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Status Badge */}
          {status !== 'idle' && (
            <div className={`badge ${getBadgeClass()}`}>
              {status === 'running' && <div className="spinner" />}
              {status === 'completed' && <CheckCircle2 size={12} />}
              {status === 'failed' && <AlertCircle size={12} />}
              {status}
            </div>
          )}

          {/* Execution Time */}
          {executionTime !== null && executionTime !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              <Clock size={12} />
              <span>{executionTime}ms</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Terminal Output Area */}
      <div style={{ 
        flex: 1, 
        padding: '16px', 
        overflowY: 'auto',
        backgroundColor: 'var(--bg-primary)'
      }}>
        {/* Terminal Prompt Line */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent-success)' }}>$</span>
          <span>python main.py</span>
        </div>

        <pre style={{ 
          margin: 0, 
          fontFamily: 'var(--font-mono)', 
          whiteSpace: 'pre-wrap', 
          fontSize: '13px',
          lineHeight: '1.5',
          color: status === 'failed' ? 'var(--accent-danger)' : 'var(--text-primary)'
        }}>
          {output || 'Ready to execute...'}
        </pre>
      </div>
    </div>
  );
}

export default OutputPanel;
