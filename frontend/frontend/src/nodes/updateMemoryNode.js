import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const UpdateMemoryNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [memoryKey, setMemoryKey] = useState(data?.memoryKey || 'conversation_history');
  const [memoryValue, setMemoryValue] = useState(data?.memoryValue || '');

  useEffect(() => {
    if (data?.memoryKey === undefined) {
      updateNodeField(id, 'memoryKey', memoryKey);
    }
    if (data?.memoryValue === undefined) {
      updateNodeField(id, 'memoryValue', memoryValue);
    }
  }, [id, data, memoryKey, memoryValue, updateNodeField]);

  const handleKeyChange = (e) => {
    setMemoryKey(e.target.value);
    updateNodeField(id, 'memoryKey', e.target.value);
  };

  const handleValueChange = (e) => {
    setMemoryValue(e.target.value);
    updateNodeField(id, 'memoryValue', e.target.value);
  };

  const memoryIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <path d="M6 12h4M14 12h4"/>
      <path d="M6 9v6M10 9v6M14 9v6M18 9v6"/>
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Update Memory"
      icon={memoryIcon}
      inputs={['memory_update']}
      outputs={['status']}
      themeColor="#10b981"
    >
      <div className="node-form-group">
        <label className="node-label">Memory Key</label>
        <input
          type="text"
          value={memoryKey}
          placeholder="e.g. conversation_history"
          onChange={handleKeyChange}
          className="node-input"
        />
      </div>
      <div className="node-form-group">
        <label className="node-label">Memory Value</label>
        <textarea
          value={memoryValue}
          onChange={handleValueChange}
          className="node-textarea"
          rows={2}
          placeholder="Value to write into LLM memory..."
        />
      </div>
    </BaseNode>
  );
};
