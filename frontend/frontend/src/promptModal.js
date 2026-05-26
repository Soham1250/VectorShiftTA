import React, { useState, useEffect, useRef } from 'react';
import { useStore } from './store';

export const PromptModal = () => {
  const promptData = useStore((state) => state.prompt);
  const hidePrompt = useStore((state) => state.hidePrompt);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  // Sync state and focus input when prompt opens
  useEffect(() => {
    if (promptData) {
      setInputValue(promptData.defaultValue || '');
      // Wait for DOM to render then focus & select
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [promptData]);

  if (!promptData) return null;

  const handleConfirm = () => {
    const trimmed = inputValue.trim();
    promptData.onConfirm(trimmed);
  };

  const handleCancel = () => {
    if (promptData.onCancel) {
      promptData.onCancel();
    }
    hidePrompt();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-status-icon status-warning" style={{ color: 'var(--accent)', background: 'var(--accent-soft)', borderColor: 'var(--accent)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <h2 className="modal-title">{promptData.title}</h2>
        </div>
        
        <div className="modal-body">
          <div className="modal-description" style={{ fontSize: '16px', textAlign: 'center', marginBottom: '16px', marginTop: '0' }}>
            {promptData.message}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="node-input"
            style={{ fontSize: '17px', padding: '12px 14px' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '16px', width: '100%', marginTop: '10px' }}>
          <button 
            className="modal-close-btn" 
            onClick={handleCancel}
            style={{ flex: 1, margin: 0 }}
          >
            Cancel
          </button>
          <button 
            className="submit-btn" 
            onClick={handleConfirm}
            style={{ flex: 1, padding: '13px 31px', fontSize: '17.5px', justifyContent: 'center' }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
