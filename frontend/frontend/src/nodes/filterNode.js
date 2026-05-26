import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const FilterNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [template, setTemplate] = useState(data?.template || 'Hello {{var_1}}, your request is {{var_2}}.');

  useEffect(() => {
    if (data?.template === undefined) {
      updateNodeField(id, 'template', template);
    }
  }, [id, data, template, updateNodeField]);

  const handleTemplateChange = (e) => {
    setTemplate(e.target.value);
    updateNodeField(id, 'template', e.target.value);
  };

  const filterIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Filter"
      icon={filterIcon}
      inputs={['var_1', 'var_2', 'var_3']}
      outputs={['prompt_string']}
      themeColor="#059669" /* Green */
    >
      <div className="node-form-group">
        <label className="node-label">Prompt Template</label>
        <textarea 
          value={template} 
          onChange={handleTemplateChange} 
          className="node-textarea"
          rows={2}
        />
      </div>
    </BaseNode>
  );
};
