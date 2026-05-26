import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    updateNodeField(id, 'inputName', e.target.value);
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
    updateNodeField(id, 'inputType', e.target.value);
  };

  const inputIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Input"
      icon={inputIcon}
      inputs={[]}
      outputs={['value']}
      themeColor="#10b981" /* Teal */
    >
      <div className="node-form-group">
        <label className="node-label">Name</label>
        <input 
          type="text" 
          value={currName} 
          onChange={handleNameChange} 
          className="node-input"
        />
      </div>
      <div className="node-form-group">
        <label className="node-label">Type</label>
        <select value={inputType} onChange={handleTypeChange} className="node-select">
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>
    </BaseNode>
  );
};
