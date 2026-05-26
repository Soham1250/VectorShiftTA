import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const DatabaseNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [sysPrompt, setSysPrompt] = useState(data?.sysPrompt || 'You are a helpful assistant.');

  useEffect(() => {
    if (data?.sysPrompt === undefined) {
      updateNodeField(id, 'sysPrompt', sysPrompt);
    }
  }, [id, data, sysPrompt, updateNodeField]);

  const handleSysPromptChange = (e) => {
    setSysPrompt(e.target.value);
    updateNodeField(id, 'sysPrompt', e.target.value);
  };

  const dbIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Database"
      icon={dbIcon}
      inputs={['exec_in']}
      outputs={['exec_out_1', 'exec_out_2']}
      themeColor="#ec4899" /* Pink */
    >
      <div className="node-form-group">
        <label className="node-label">System Prompt</label>
        <textarea 
          value={sysPrompt} 
          onChange={handleSysPromptChange} 
          className="node-textarea"
          rows={3}
        />
      </div>
    </BaseNode>
  );
};
