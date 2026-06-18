import React from 'react';
import { Palette } from 'lucide-react';

function ThemeSelector({ theme, onChange }) {
  return (
    <div className="theme-selector" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Palette size={16} color="var(--text-secondary)" />
      <select
        id="theme-select"
        value={theme}
        onChange={(e) => onChange(e.target.value)}
        className="select-modern"
      >
        <option value="dark">Dark Theme</option>
        <option value="light">Light Theme</option>
        <option value="dracula">Dracula</option>
      </select>
    </div>
  );
}

export default ThemeSelector;
