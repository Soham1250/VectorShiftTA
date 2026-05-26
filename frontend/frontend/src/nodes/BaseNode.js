import React from 'react';
import { Handle, Position } from 'reactflow';

export const BaseNode = ({
  id,
  title,
  icon,
  inputs = [],
  outputs = [],
  children,
  themeColor = '#6965db', // standard Excalidraw indigo accent
  className = '',
  style = {},
}) => {
  // Spacing algorithm for equal distribution down left/right boundaries
  const getHandleStyle = (index, total) => {
    if (total <= 1) return { top: '50%' };
    return { top: `${((index + 1) * 100) / (total + 1)}%` };
  };

  const getThemeColor = (color) => {
    switch (color) {
      case '#10b981': return 'var(--color-green)';
      case '#8b5cf6': return 'var(--color-purple)';
      case '#06b6d4': return 'var(--color-cyan)';
      case '#f59e0b': return 'var(--color-amber)';
      case '#3b82f6': return 'var(--color-blue)';
      case '#ec4899': return 'var(--color-pink)';
      case '#a855f7': return 'var(--color-purple)';
      default: return color;
    }
  };

  const activeColor = getThemeColor(themeColor);

  return (
    <div
      className={`custom-flow-node ${className}`}
      style={{
        borderTop: `4px solid ${activeColor}`,
        borderLeft: '1.5px solid var(--node-border)',
        borderRight: '1.5px solid var(--node-border)',
        borderBottom: '1.5px solid var(--node-border)',
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
              background: activeColor,
              borderColor: 'var(--node-border)',
              borderWidth: '1.5px',
              width: '12px',
              height: '12px',
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
              background: activeColor,
              borderColor: 'var(--node-border)',
              borderWidth: '1.5px',
              width: '12px',
              height: '12px',
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
