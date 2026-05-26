import React, { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  deleteSelected: state.deleteSelected,
  showAlert: state.showAlert,
});

export const SubmitButton = () => {
  const { nodes, edges, deleteSelected, showAlert } = useStore(selector, shallow);
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setResult(data);
      setIsOpen(true);
    } catch (error) {
      console.error('Error submitting pipeline:', error);
      showAlert(
        "Submission Error",
        "Could not connect to the backend server at http://localhost:8000/pipelines/parse. Please make sure the FastAPI server is running.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const hasSelected = nodes.some((node) => node.selected);

  return (
    <>
      <div className="submit-btn-container" style={{ gap: '16px' }}>
        <button
          onClick={deleteSelected}
          disabled={!hasSelected}
          className="delete-selected-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
          <span>Delete Selected</span>
        </button>

        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="submit-btn"
        >
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <>
              <span>Submit Pipeline</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </>
          )}
        </button>
      </div>

      {isOpen && result && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className={`modal-status-icon ${result.is_dag ? 'status-success' : 'status-warning'}`}>
                {result.is_dag ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                )}
              </div>
              <h2 className="modal-title">Pipeline Submission Results</h2>
            </div>
            
            <div className="modal-body">
              <div className="stat-row">
                <span className="stat-label">Total Nodes</span>
                <span className="stat-value">{result.num_nodes}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Total Edges</span>
                <span className="stat-value">{result.num_edges}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Structure</span>
                <span className={`stat-value badge ${result.is_dag ? 'badge-dag-success' : 'badge-dag-fail'}`}>
                  {result.is_dag ? 'Valid DAG (Acyclic)' : 'Cyclic (Not a DAG)'}
                </span>
              </div>
              
              <div className="modal-description">
                {result.is_dag 
                  ? 'Your pipeline has no cycles and is ready to execute.' 
                  : 'Your pipeline contains cycles (circular dependencies). Please resolve them before executing.'}
              </div>
            </div>
            
            <button className="modal-close-btn" onClick={() => setIsOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
