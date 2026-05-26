import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    updateNodeField(id, 'outputName', e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
    updateNodeField(id, 'outputType', e.target.value);
  };

  const outputIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Output"
      icon={outputIcon}
      inputs={['value']}
      outputs={[]}
      themeColor="#06b6d4" /* Cyan */
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
        <select value={outputType} onChange={handleTypeChange} className="node-select">
          <option value="Text">Text</option>
          <option value="File">Image</option>
        </select>
      </div>
    </BaseNode>
  );
};
