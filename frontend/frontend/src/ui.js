// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background } from 'reactflow';
import { useStore, generateHash, getNodeName } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { DelayNode } from './nodes/delayNode';
import { ConditionalNode } from './nodes/conditionalNode';
import { SqlQueryNode } from './nodes/sqlQueryNode';
import { SkipNode } from './nodes/skipNode';
import { UpdateMemoryNode } from './nodes/updateMemoryNode';

import 'reactflow/dist/style.css';

const gridSize = 26;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  delay: DelayNode,
  conditional: ConditionalNode,
  sqlQuery: SqlQueryNode,
  skip: SkipNode,
  updateMemory: UpdateMemoryNode,
};



const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  showPrompt: state.showPrompt,
  hidePrompt: state.hidePrompt,
  showAlert: state.showAlert,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const theme = useStore((state) => state.theme);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect,
      showPrompt,
      hidePrompt,
      showAlert
    } = useStore(selector, shallow);

    useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const gridColor = theme === 'light' ? '#e0e0e0' : '#2d2d2d';

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
      } else if (type === 'delay') {
        nodeData.title = 'Delay';
        nodeData.duration = 5;
        nodeData.unit = 'Seconds';
      } else if (type === 'conditional') {
        nodeData.title = 'Conditional';
        nodeData.condition = 'value > 0';
      } else if (type === 'sqlQuery') {
        nodeData.title = 'SQL Query';
        nodeData.database = 'production_db';
        nodeData.query = 'SELECT * FROM users WHERE active = 1;';
      } else if (type === 'skip') {
        nodeData.title = 'Skip';
        nodeData.condition = 'status === "inactive"';
      } else if (type === 'updateMemory') {
        nodeData.title = 'Update Memory';
        nodeData.memoryKey = 'conversation_history';
        nodeData.memoryValue = '';
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

            const handlePromptConfirm = (enteredName) => {
              enteredName = enteredName.trim();
              if (!enteredName) {
                showAlert("Validation Error", "Node name is mandatory. Please enter a valid name.", "warning");
                return;
              }

              const newHash = generateHash(enteredName);
              const hasConflict = nodes.some((n) => generateHash(getNodeName(n)) === newHash);

              if (hasConflict) {
                showAlert("Naming Conflict", `A node with the name "${enteredName}" already exists on the canvas. Please choose a unique name.`, "warning");
                return;
              }

              hidePrompt();
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
            };

            showPrompt(
              `Create ${type === 'customInput' ? 'Input' : type === 'customOutput' ? 'Output' : type.toUpperCase()} Node`,
              `Enter a unique name for the new ${type} node:`,
              defaultSuggestedName,
              handlePromptConfirm
            );
          }
        },
        [reactFlowInstance, getNodeID, addNode, nodes, showAlert, showPrompt, hidePrompt]
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

                    const handlePasteConfirm = (enteredName) => {
                        enteredName = enteredName.trim();
                        if (!enteredName) {
                            showAlert("Validation Error", "Node name is mandatory. Please enter a valid name.", "warning");
                            return;
                        }

                        const newHash = generateHash(enteredName);
                        const hasConflict = nodes.some((n) => generateHash(getNodeName(n)) === newHash);

                        if (hasConflict) {
                            showAlert("Naming Conflict", `A node with the name "${enteredName}" already exists on the canvas. Please choose a unique name.`, "warning");
                            return;
                        }

                        hidePrompt();
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
                    };

                    showPrompt(
                        "Paste Node",
                        `Enter a unique name for the copied ${sourceNode.type} node:`,
                        defaultCopyName,
                        handlePasteConfirm
                    );
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [nodes, addNode, getNodeID, showAlert, showPrompt, hidePrompt]);

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
                    <Background color={gridColor} gap={gridSize} size={1.5} />
                    <Controls className="custom-flow-controls" />
                </ReactFlow>
            </div>
        </div>
    )
}
