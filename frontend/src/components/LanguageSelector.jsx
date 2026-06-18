import React from 'react';

function LanguageSelector({ language, onChange }) {
  const languages = ['python', 'javascript']; // Showing JS as per frontend options originally

  return (
    <div className="language-selector">
      <select 
        value={language} 
        onChange={(e) => onChange(e.target.value)}
        className="select-modern"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang === 'javascript' ? 'JavaScript' : lang.charAt(0).toUpperCase() + lang.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;
