import React from 'react';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const brainIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="M12 6v12M6 12h12"/>
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title="LLM"
      icon={brainIcon}
      inputs={['system', 'prompt']}
      outputs={['response']}
      themeColor="#8b5cf6" /* Purple */
    >
      <div className="node-description">
        This is a Large Language Model (LLM) processor node.
      </div>
    </BaseNode>
  );
};
