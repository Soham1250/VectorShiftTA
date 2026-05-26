// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore, generateHash, getNodeName } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { FilterNode } from './nodes/filterNode';
import { TimerNode } from './nodes/timerNode';
import { MergeNode } from './nodes/mergeNode';
import { DatabaseNode } from './nodes/databaseNode';
import { MathNode } from './nodes/mathNode';
import { GenericCustomNode } from './nodes/genericCustomNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  filter: FilterNode,
  timer: TimerNode,
  merge: MergeNode,
  database: DatabaseNode,
  math: MathNode,
  genericCustom: GenericCustomNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type, customNodeData) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      if (type === 'customInput') {
        nodeData.inputName = nodeID.replace('customInput-', 'input_');
        nodeData.inputType = 'Text';
      } else if (type === 'customOutput') {
        nodeData.outputName = nodeID.replace('customOutput-', 'output_');
        nodeData.outputType = 'Text';
      } else if (type === 'llm') {
        nodeData.title = 'LLM';
      } else if (type === 'text') {
        nodeData.title = 'Text';
        nodeData.text = '{{input}}';
      } else if (type === 'filter') {
        nodeData.title = 'Filter';
      } else if (type === 'timer') {
        nodeData.title = 'Timer';
      } else if (type === 'merge') {
        nodeData.title = 'Merge';
      } else if (type === 'database') {
        nodeData.title = 'Database';
      } else if (type === 'math') {
        nodeData.title = 'Math Branch';
      } else if (type === 'genericCustom' && customNodeData) {
        nodeData = { ...nodeData, ...customNodeData };
      }
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
            const customNodeData = appData?.customNodeData;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);

            // Generate default suggested unique name
            const defaultSuggestedName = type === 'customInput' 
              ? nodeID.replace('customInput-', 'input_')
              : (type === 'customOutput' 
                  ? nodeID.replace('customOutput-', 'output_') 
                  : (customNodeData?.title || `${type}_${nodeID.split('-')[1]}`));

            let enteredName = "";
            let isUnique = false;

            // Prompt user until they enter a unique name or cancel drop
            while (!isUnique) {
              enteredName = window.prompt(`Enter a unique name for the new ${type} node:`, defaultSuggestedName);

              if (enteredName === null) {
                return; // User clicked Cancel, terminate drop
              }

              enteredName = enteredName.trim();
              if (!enteredName) {
                alert("Node name is mandatory. Please enter a valid name.");
                continue;
              }

              const newHash = generateHash(enteredName);
              const hasConflict = nodes.some((n) => generateHash(getNodeName(n)) === newHash);

              if (hasConflict) {
                alert(`Naming conflict: A node with the name "${enteredName}" already exists on the canvas. Please choose a unique name.`);
              } else {
                isUnique = true;
              }
            }

            // Create initial data and update with custom unique name
            const initialData = getInitNodeData(nodeID, type, customNodeData);
            if (type === 'customInput') {
              initialData.inputName = enteredName;
            } else if (type === 'customOutput') {
              initialData.outputName = enteredName;
            } else {
              initialData.title = enteredName;
            }

            const newNode = {
              id: nodeID,
              type,
              position,
              data: initialData,
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode, nodes]
    );

    // Keyboard listener for Copy (Ctrl+C) and Paste (Ctrl+V)
    const copiedNodeRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Ignore keypresses inside form inputs
            const activeEl = document.activeElement;
            const isInput = activeEl && (
                activeEl.tagName === 'INPUT' || 
                activeEl.tagName === 'TEXTAREA' || 
                activeEl.tagName === 'SELECT'
            );
            if (isInput) return;

            // Copy: Ctrl + C
            if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
                const selectedNode = nodes.find((n) => n.selected);
                if (selectedNode) {
                    copiedNodeRef.current = selectedNode;
                    event.preventDefault();
                }
            }

            // Paste: Ctrl + V
            if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
                if (copiedNodeRef.current) {
                    event.preventDefault();
                    const sourceNode = copiedNodeRef.current;
                    
                    const sourceName = getNodeName(sourceNode);
                    const defaultCopyName = `${sourceName}_copy`;

                    let enteredName = "";
                    let isUnique = false;

                    // Prompt user for a unique name for the pasted node
                    while (!isUnique) {
                        enteredName = window.prompt(
                            `Paste Node: Enter a unique name for the copied ${sourceNode.type} node:`,
                            defaultCopyName
                        );

                        if (enteredName === null) {
                            return; // Cancel paste
                        }

                        enteredName = enteredName.trim();
                        if (!enteredName) {
                            alert("Node name is mandatory. Please enter a valid name.");
                            continue;
                        }

                        const newHash = generateHash(enteredName);
                        const hasConflict = nodes.some((n) => generateHash(getNodeName(n)) === newHash);

                        if (hasConflict) {
                            alert(`Naming conflict: A node with the name "${enteredName}" already exists on the canvas.`);
                        } else {
                            isUnique = true;
                        }
                    }

                    const newId = getNodeID(sourceNode.type);
                    const newData = { ...sourceNode.data, id: newId };
                    
                    if (sourceNode.type === 'customInput') {
                        newData.inputName = enteredName;
                    } else if (sourceNode.type === 'customOutput') {
                        newData.outputName = enteredName;
                    } else {
                        newData.title = enteredName;
                    }

                    const pastedNode = {
                        id: newId,
                        type: sourceNode.type,
                        position: {
                            x: sourceNode.position.x + 40,
                            y: sourceNode.position.y + 40,
                        },
                        data: newData,
                    };

                    addNode(pastedNode);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [nodes, addNode, getNodeID]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <div className="flow-canvas-wrapper">
            <div ref={reactFlowWrapper} className="flow-canvas-container">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onInit={setReactFlowInstance}
                    nodeTypes={nodeTypes}
                    proOptions={proOptions}
                    snapGrid={[gridSize, gridSize]}
                    connectionLineType='smoothstep'
                    deleteKeyCode={["Backspace", "Delete"]}
                    selectionOnDrag={true}
                    panOnDrag={[1, 2]}
                    selectionMode="partial"
                >
                    <Background color="#D9D3C5" gap={gridSize} size={1.5} />
                    <Controls className="custom-flow-controls" />
                    <MiniMap className="custom-flow-minimap" />
                </ReactFlow>
            </div>
        </div>
    )
}
