import React from 'react';
import { Handle, Position } from 'reactflow';

export const BaseNode = ({
  id,
  title,
  icon,
  inputs = [],
  outputs = [],
  children,
  themeColor = '#818cf8', // standard indigo accent
  className = '',
  style = {},
}) => {
  // Spacing algorithm for equal distribution down left/right boundaries
  const getHandleStyle = (index, total) => {
    if (total <= 1) return { top: '50%' };
    return { top: `${((index + 1) * 100) / (total + 1)}%` };
  };

  return (
    <div
      className={`custom-flow-node ${className}`}
      style={{
        borderTop: `3px solid ${themeColor}`,
        borderLeft: '1px solid var(--rule-dk)',
        borderRight: '1px solid var(--rule-dk)',
        borderBottom: '1px solid var(--rule-dk)',
        ...style
      }}
    >
      {/* Target/Input Handles (Left boundary) */}
      {inputs.map((handleConfig, idx) => {
        const isObject = typeof handleConfig === 'object' && handleConfig !== null;
        const handleSuffix = isObject ? handleConfig.id : handleConfig;
        const customStyle = isObject ? handleConfig.style : {};
        const spacingStyle = getHandleStyle(idx, inputs.length);
        const handleId = `${id}-${handleSuffix}`;

        return (
          <Handle
            key={`in-${handleId}`}
            type="target"
            position={Position.Left}
            id={handleId}
            style={{
              background: themeColor,
              borderColor: '#ffffff',
              borderWidth: '2px',
              width: '9px',
              height: '9px',
              transition: 'all 0.2s ease',
              ...spacingStyle,
              ...customStyle,
            }}
            className="node-handle"
          />
        );
      })}

      {/* Source/Output Handles (Right boundary) */}
      {outputs.map((handleConfig, idx) => {
        const isObject = typeof handleConfig === 'object' && handleConfig !== null;
        const handleSuffix = isObject ? handleConfig.id : handleConfig;
        const customStyle = isObject ? handleConfig.style : {};
        const spacingStyle = getHandleStyle(idx, outputs.length);
        const handleId = `${id}-${handleSuffix}`;

        return (
          <Handle
            key={`out-${handleId}`}
            type="source"
            position={Position.Right}
            id={handleId}
            style={{
              background: themeColor,
              borderColor: '#ffffff',
              borderWidth: '2px',
              width: '9px',
              height: '9px',
              transition: 'all 0.2s ease',
              ...spacingStyle,
              ...customStyle,
            }}
            className="node-handle"
          />
        );
      })}

      {/* Node Header */}
      <div className="node-header">
        {icon && <span className="node-icon">{icon}</span>}
        <span className="node-title">{title}</span>
      </div>

      {/* Node Content */}
      <div className="node-content">
        {children}
      </div>
    </div>
  );
};
