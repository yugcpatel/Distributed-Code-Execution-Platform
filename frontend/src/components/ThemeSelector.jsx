import React from 'react';

function ThemeSelector({ theme, onChange }) {
  return (
    <div className="theme-selector" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '15px' }}>
      <label htmlFor="theme-select" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Theme:</label>
      <select
        id="theme-select"
        value={theme}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '6px 12px',
          borderRadius: '4px',
          backgroundColor: 'var(--bg-tertiary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          cursor: 'pointer',
          outline: 'none',
          fontFamily: 'inherit'
        }}
      >
        <option value="dark">Dark (Premium)</option>
        <option value="light">Light</option>
        <option value="dracula">Dracula</option>
      </select>
    </div>
  );
}

export default ThemeSelector;
