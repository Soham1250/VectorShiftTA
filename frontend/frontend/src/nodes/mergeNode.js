import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const MergeNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [method, setMethod] = useState(data?.method || 'POST');
  const [retries, setRetries] = useState(data?.retries || 3);

  useEffect(() => {
    if (data?.method === undefined) {
      updateNodeField(id, 'method', method);
    }
    if (data?.retries === undefined) {
      updateNodeField(id, 'retries', retries);
    }
  }, [id, data, method, retries, updateNodeField]);

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
    updateNodeField(id, 'method', e.target.value);
  };

  const handleRetriesChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    setRetries(val);
    updateNodeField(id, 'retries', val);
  };

  const mergeIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h-6a4 4 0 0 0-4 4v8M6 8h6a4 4 0 0 1 4 4v8" />
      <circle cx="12" cy="18" r="3" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Merge"
      icon={mergeIcon}
      inputs={['url', 'payload']}
      outputs={['response', 'error']}
      themeColor="#8b5cf6" /* Violet */
    >
      <div className="node-form-group">
        <label className="node-label">Request Method</label>
        <select value={method} onChange={handleMethodChange} className="node-select">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <div className="node-form-group">
        <label className="node-label">Max Retries</label>
        <input 
          type="number" 
          value={retries} 
          min="0"
          max="10"
          onChange={handleRetriesChange} 
          className="node-input"
        />
      </div>
    </BaseNode>
  );
};
