import React from 'react';

function LanguageSelector({ language, onChange }) {
  const languages = ['javascript', 'python'];

  return (
    <div className="language-selector">
      <select value={language} onChange={(e) => onChange(e.target.value)}>
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;
