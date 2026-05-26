import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const SqlQueryNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [database, setDatabase] = useState(data?.database || 'production_db');
  const [query, setQuery] = useState(data?.query || 'SELECT * FROM users WHERE active = 1;');

  useEffect(() => {
    if (data?.database === undefined) {
      updateNodeField(id, 'database', database);
    }
    if (data?.query === undefined) {
      updateNodeField(id, 'query', query);
    }
  }, [id, data, database, query, updateNodeField]);

  const handleDatabaseChange = (e) => {
    setDatabase(e.target.value);
    updateNodeField(id, 'database', e.target.value);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    updateNodeField(id, 'query', e.target.value);
  };

  const sqlIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="SQL Query"
      icon={sqlIcon}
      inputs={['query_params']}
      outputs={['results', 'error']}
      themeColor="#ec4899"
    >
      <div className="node-form-group">
        <label className="node-label">Database</label>
        <select value={database} onChange={handleDatabaseChange} className="node-select">
          <option value="production_db">Production DB</option>
          <option value="staging_db">Staging DB</option>
          <option value="analytics_db">Analytics DB</option>
          <option value="replica_db">Read Replica</option>
        </select>
      </div>
      <div className="node-form-group">
        <label className="node-label">SQL Query</label>
        <textarea
          value={query}
          onChange={handleQueryChange}
          className="node-textarea"
          rows={3}
          style={{ fontFamily: 'monospace', fontSize: '12px' }}
        />
      </div>
    </BaseNode>
  );
};
