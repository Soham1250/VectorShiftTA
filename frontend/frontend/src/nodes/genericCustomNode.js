import React from 'react';
import { BaseNode } from './BaseNode';

export const GenericCustomNode = ({ id, data }) => {
  const customIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="9" y1="9" x2="15" y2="9"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
      <line x1="9" y1="17" x2="13" y2="17"/>
    </svg>
  );

  return (
    <BaseNode
      id={id}
      title={data.title || 'Custom Node'}
      icon={customIcon}
      inputs={data.inputs || []}
      outputs={data.outputs || []}
      themeColor={data.themeColor || '#818cf8'}
    >
      <div className="node-description" style={{ fontSize: '11px', color: '#94a3b8' }}>
        Dynamically compiled custom workspace node.
      </div>
      <div className="node-badge-container" style={{ marginTop: '8px' }}>
        <span 
          className="node-badge" 
          style={{ 
            background: `${data.themeColor || '#818cf8'}20`, 
            color: data.themeColor || '#818cf8', 
            border: `1px solid ${data.themeColor || '#818cf8'}40`,
            padding: '2px 6px',
            fontSize: '9px',
            borderRadius: '4px'
          }}
        >
          Developer-Created
        </span>
      </div>
    </BaseNode>
  );
};
