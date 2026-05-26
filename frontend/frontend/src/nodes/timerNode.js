import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const TimerNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [dbName, setDbName] = useState(data?.dbName || 'vector_db_1');
  const [metric, setMetric] = useState(data?.metric || 'Cosine');

  useEffect(() => {
    if (data?.dbName === undefined) {
      updateNodeField(id, 'dbName', dbName);
    }
    if (data?.metric === undefined) {
      updateNodeField(id, 'metric', metric);
    }
  }, [id, data, dbName, metric, updateNodeField]);

  const handleDbNameChange = (e) => {
    setDbName(e.target.value);
    updateNodeField(id, 'dbName', e.target.value);
  };

  const handleMetricChange = (e) => {
    setMetric(e.target.value);
    updateNodeField(id, 'metric', e.target.value);
  };

  const timerIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Timer"
      icon={timerIcon}
      inputs={['vector_in_1', 'vector_in_2']}
      outputs={['search_query_out']}
      themeColor="#f97316" /* Orange */
    >
      <div className="node-form-group">
        <label className="node-label">Vector Database</label>
        <input 
          type="text" 
          value={dbName} 
          onChange={handleDbNameChange} 
          className="node-input"
        />
      </div>
      <div className="node-form-group">
        <label className="node-label">Similarity Metric</label>
        <select value={metric} onChange={handleMetricChange} className="node-select">
          <option value="Cosine">Cosine</option>
          <option value="Euclidean">L2 (Euclidean)</option>
          <option value="DotProduct">Dot Product</option>
        </select>
      </div>
    </BaseNode>
  );
};
