import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const DelayNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [duration, setDuration] = useState(data?.duration || 5);
  const [unit, setUnit] = useState(data?.unit || 'Seconds');

  useEffect(() => {
    if (data?.duration === undefined) {
      updateNodeField(id, 'duration', duration);
    }
    if (data?.unit === undefined) {
      updateNodeField(id, 'unit', unit);
    }
  }, [id, data, duration, unit, updateNodeField]);

  const handleDurationChange = (e) => {
    const val = Math.max(0, parseInt(e.target.value) || 0);
    setDuration(val);
    updateNodeField(id, 'duration', val);
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
    updateNodeField(id, 'unit', e.target.value);
  };

  const delayIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Delay"
      icon={delayIcon}
      inputs={['input']}
      outputs={['output']}
      themeColor="#f59e0b"
    >
      <div className="node-form-group">
        <label className="node-label">Duration</label>
        <input
          type="number"
          value={duration}
          min="0"
          onChange={handleDurationChange}
          className="node-input"
        />
      </div>
      <div className="node-form-group">
        <label className="node-label">Unit</label>
        <select value={unit} onChange={handleUnitChange} className="node-select">
          <option value="Seconds">Seconds</option>
          <option value="Minutes">Minutes</option>
          <option value="Hours">Hours</option>
        </select>
      </div>
      <div className="node-description">
        Execution pauses until the timer completes.
      </div>
    </BaseNode>
  );
};
