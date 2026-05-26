import React from 'react';
import { useStore } from './store';

export const AlertModal = () => {
  const alertData = useStore((state) => state.alert);
  const hideAlert = useStore((state) => state.hideAlert);

  if (!alertData) return null;

  return (
    <div className="modal-overlay" onClick={hideAlert}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-status-icon status-warning">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h2 className="modal-title">{alertData.title}</h2>
        </div>
        
        <div className="modal-body">
          <div className="modal-description" style={{ fontSize: '17px', textAlign: 'center', marginTop: '10px' }}>
            {alertData.message}
          </div>
        </div>
        
        <button className="modal-close-btn" onClick={hideAlert}>
          Close
        </button>
      </div>
    </div>
  );
};
