import React from 'react';

function LanguageSelector({ language, onChange }) {
  const languages = ['python', 'cpp', 'javascript']; 

  return (
    <div className="language-selector">
      <select 
        value={language} 
        onChange={(e) => onChange(e.target.value)}
        className="select-modern"
      >
        {languages.map((lang) => {
          let displayName = lang;
          if (lang === 'javascript') displayName = 'JavaScript';
          if (lang === 'cpp') displayName = 'C++';
          if (lang === 'python') displayName = 'Python';
          
          return (
            <option key={lang} value={lang}>
              {displayName}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default LanguageSelector;
