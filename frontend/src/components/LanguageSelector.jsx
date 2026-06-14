// Import React so we can build components
import React from 'react';

// This function creates our LanguageSelector component.
// It takes 'language' (the currently selected language) and 'onChange' (function to run when user changes selection)
function LanguageSelector({ language, onChange }) {
  // We define an array of the programming languages we support
  const languages = ['javascript', 'python'];

  // We return a dropdown (<select>) element
  return (
    <div className="language-selector" style={{ marginBottom: '10px' }}>
      {/* 
        The select's value is tied to our 'language' state.
        When a user selects a new option, the onChange event fires 
        and we pass the new value to our onChange prop function.
      */}
      <select 
        value={language} 
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: '8px', borderRadius: '4px', background: '#1f2633', color: 'white', border: '1px solid #2e3748' }}
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
