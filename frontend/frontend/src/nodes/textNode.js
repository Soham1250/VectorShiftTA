import { useState, useEffect, useRef } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const textareaRef = useRef(null);

  // Sync initial state to store if not already present
  useEffect(() => {
    if (data?.text === undefined) {
      updateNodeField(id, 'text', currText);
    }
  }, [id, data, currText, updateNodeField]);

  const handleTextChange = (e) => {
    const textValue = e.target.value;
    setCurrText(textValue);
    updateNodeField(id, 'text', textValue);
  };

  // Extract variables enclosed in double curly brackets: {{ varName }}
  const extractVariables = (text) => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const variables = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    return variables;
  };

  const variables = extractVariables(currText);

  // Auto-resize textarea height and width based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Auto-resize height
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

      // Auto-resize width
      const lines = currText.split('\n');
      const maxLineLength = lines.reduce((max, line) => Math.max(max, line.length), 0);
      const estimatedWidth = Math.max(180, Math.min(maxLineLength * 8.5 + 24, 400));
      textareaRef.current.style.width = `${estimatedWidth}px`;
    }
  }, [currText]);

  const textIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="Text"
      icon={textIcon}
      inputs={variables}
      outputs={['output']}
      themeColor="#f59e0b" /* Amber */
      style={{ width: 'auto', height: 'auto' }} // Allow node card to size to contents
    >
      <div className="node-form-group">
        <label className="node-label">Text Content</label>
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={handleTextChange}
          className="node-textarea"
          rows={1}
          style={{ resize: 'none', overflow: 'hidden' }}
        />
      </div>
    </BaseNode>
  );
};
