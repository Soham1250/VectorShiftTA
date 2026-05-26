import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const MathNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [evaluation, setEvaluation] = useState(data?.evaluation || 'x > 10');

  useEffect(() => {
    if (data?.evaluation === undefined) {
      updateNodeField(id, 'evaluation', evaluation);
    }
  }, [id, data, evaluation, updateNodeField]);

  const handleEvaluationChange = (e) => {
    setEvaluation(e.target.value);
    updateNodeField(id, 'evaluation', e.target.value);
  };

  const mathIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Math Branch"
      icon={mathIcon}
      inputs={['data_in']}
      outputs={['true_out', 'false_out']}
      themeColor="#6366f1" /* Indigo */
    >
      <div className="node-form-group">
        <label className="node-label">Condition Evaluation</label>
        <input 
          type="text" 
          value={evaluation} 
          placeholder="e.g. value > 100"
          onChange={handleEvaluationChange} 
          className="node-input"
        />
      </div>
      <div className="node-badge-container">
        <span className="node-badge badge-green">T: True</span>
        <span className="node-badge badge-red">F: False</span>
      </div>
    </BaseNode>
  );
};
