import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const ConditionalNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [condition, setCondition] = useState(data?.condition || 'value > 0');

  useEffect(() => {
    if (data?.condition === undefined) {
      updateNodeField(id, 'condition', condition);
    }
  }, [id, data, condition, updateNodeField]);

  const handleConditionChange = (e) => {
    setCondition(e.target.value);
    updateNodeField(id, 'condition', e.target.value);
  };

  const conditionalIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Conditional"
      icon={conditionalIcon}
      inputs={['input']}
      outputs={['true', 'false']}
      themeColor="#3b82f6"
    >
      <div className="node-form-group">
        <label className="node-label">Condition</label>
        <input
          type="text"
          value={condition}
          placeholder="e.g. value > 0"
          onChange={handleConditionChange}
          className="node-input"
        />
      </div>
      <div className="node-badge-container">
        <span className="node-badge badge-green">✓ True</span>
        <span className="node-badge badge-red">✗ False</span>
      </div>
    </BaseNode>
  );
};
