// draggableNode.js

export const DraggableNode = ({ type, label, customNodeData }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType, customNodeData }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        className={`draggable-node node-type-${type}`}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        draggable
      >
          <span className="draggable-node-label">{label}</span>
      </div>
    );
  };
  