import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const SkipNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [condition, setCondition] = useState(data?.condition || 'status === "inactive"');

  useEffect(() => {
    if (data?.condition === undefined) {
      updateNodeField(id, 'condition', condition);
    }
  }, [id, data, condition, updateNodeField]);

  const handleConditionChange = (e) => {
    setCondition(e.target.value);
    updateNodeField(id, 'condition', e.target.value);
  };

  const skipIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 4 15 12 5 20 5 4"/>
      <line x1="19" y1="5" x2="19" y2="19"/>
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Skip"
      icon={skipIcon}
      inputs={['data_in']}
      outputs={['next_node', 'skipped']}
      themeColor="#a855f7"
    >
      <div className="node-form-group">
        <label className="node-label">Skip Condition</label>
        <input
          type="text"
          value={condition}
          placeholder='e.g. status === "inactive"'
          onChange={handleConditionChange}
          className="node-input"
        />
      </div>
      <div className="node-badge-container">
        <span className="node-badge badge-green">→ Next</span>
        <span className="node-badge badge-red">⤳ Skipped</span>
      </div>
    </BaseNode>
  );
};
