// Import React
import React from 'react';

// This function creates our ConfirmModal component.
// It takes props to control when it is open, what message to display, and functions for the buttons.
function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  // If the modal is not open, we return null so nothing is rendered on the screen.
  if (!isOpen) return null;

  return (
    // The overlay covers the entire screen with a semi-transparent dark background
    <div style={overlayStyle}>
      {/* The modal box itself sits in the middle of the screen */}
      <div style={modalStyle}>
        <h3 style={{ margin: '0 0 15px 0', color: '#f3f4f6' }}>Change Language</h3>
        <p style={{ margin: '0 0 20px 0', color: '#9ca3af' }}>{message}</p>
        
        {/* Buttons to confirm or cancel */}
        <div style={buttonContainerStyle}>
          <button onClick={onCancel} style={cancelButtonStyle}>Cancel</button>
          <button onClick={onConfirm} style={confirmButtonStyle}>Yes, clear code</button>
        </div>
      </div>
    </div>
  );
}

// Inline styles for the modal overlay to make it look premium
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000 // Ensure it sits on top of everything else
};

// Inline styles for the modal box
const modalStyle = {
  backgroundColor: '#1f2633',
  padding: '25px',
  borderRadius: '8px',
  border: '1px solid #2e3748',
  maxWidth: '400px',
  width: '100%',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px'
};

const cancelButtonStyle = {
  padding: '8px 16px',
  backgroundColor: 'transparent',
  color: '#9ca3af',
  border: '1px solid #4b5563',
  borderRadius: '4px',
  cursor: 'pointer'
};

const confirmButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#ef4444', // Red to indicate a destructive action
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

// Export the component
export default ConfirmModal;
