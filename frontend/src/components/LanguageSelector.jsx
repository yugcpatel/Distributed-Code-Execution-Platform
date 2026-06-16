// Import React so we can build components
import React from 'react';

// This function creates our LanguageSelector component.
// It takes 'language' (the currently selected language) and 'onChange' (function to run when user changes selection)
function LanguageSelector({ language, onChange }) {
  // We define an array of the programming languages we support
  const languages = ['python'];

  // We return a dropdown (<select>) element
  return (
    <div className="language-selector">
      {/* 
        The select's value is tied to our 'language' state.
        When a user selects a new option, the onChange event fires 
        and we pass the new value to our onChange prop function.
      */}
      <select 
        value={language} 
        onChange={(e) => onChange(e.target.value)}
        style={{ 
          padding: '6px 12px', 
          borderRadius: '6px', 
          background: 'var(--bg-tertiary)', 
          color: 'var(--text-primary)', 
          border: '1px solid var(--border-color)',
          cursor: 'pointer',
          outline: 'none',
          fontSize: '14px'
        }}
      >
        {/* We map over our languages array to create an <option> element for each one */}
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {/* Capitalize the first letter of the language name for display */}
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

// Export the component so it can be used in other files
export default LanguageSelector;
