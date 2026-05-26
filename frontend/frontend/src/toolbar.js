import { useState } from 'react';
import { useStore, generateHash } from './store';
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    const { 
        customNodes, 
        addCustomNode, 
        deleteCustomNode, 
        replaceCustomNode 
    } = useStore((state) => ({
        customNodes: state.customNodes,
        addCustomNode: state.addCustomNode,
        deleteCustomNode: state.deleteCustomNode,
        replaceCustomNode: state.replaceCustomNode,
    }));

    const [isCreatorOpen, setIsCreatorOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [themeColor, setThemeColor] = useState('#6366f1'); // default indigo
    const [inputsText, setInputsText] = useState('');
    const [outputsText, setOutputsText] = useState('');

    // Editing states for modifications
    const [editingIndex, setEditingIndex] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editThemeColor, setEditThemeColor] = useState('#6366f1');
    const [editInputsText, setEditInputsText] = useState('');
    const [editOutputsText, setEditOutputsText] = useState('');

    const colorPresets = [
        '#10b981', // Teal
        '#8b5cf6', // Purple
        '#06b6d4', // Cyan
        '#f59e0b', // Amber
        '#ec4899', // Pink
        '#6366f1', // Indigo
        '#f97316', // Orange
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const inputs = inputsText
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);

        const outputs = outputsText
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);

        addCustomNode({
            title: title.trim(),
            themeColor,
            inputs,
            outputs,
        });

        // Reset fields
        setTitle('');
        setInputsText('');
        setOutputsText('');
        setThemeColor('#6366f1');
        setIsCreatorOpen(false);
    };

    // Save logic comparing temporary edits with original custom node
    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (editingIndex === null || !editTitle.trim()) return;

        const parsedInputs = editInputsText
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);

        const parsedOutputs = editOutputsText
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);

        // 1. Create a temporary new node representing the edited fields
        const tempNode = {
            title: editTitle.trim(),
            themeColor: editThemeColor,
            inputs: parsedInputs,
            outputs: parsedOutputs,
        };

        const originalNode = customNodes[editingIndex];

        // Compare tempNode to originalNode
        const isIdentical = 
            tempNode.title === originalNode.title &&
            tempNode.themeColor === originalNode.themeColor &&
            JSON.stringify(tempNode.inputs) === JSON.stringify(originalNode.inputs) &&
            JSON.stringify(tempNode.outputs) === JSON.stringify(originalNode.outputs);

        if (isIdentical) {
            // 2. "if there are not changes delete the temp one"
            // Discard the temp node state and notify the user
            alert("No changes detected. The temporary edit draft has been deleted and the original node was retained.");
        } else {
            // Validate name uniqueness if the title changed (excluding itself)
            if (tempNode.title !== originalNode.title) {
                const newHash = generateHash(tempNode.title);
                const standardTitles = ['Input', 'LLM', 'Output', 'Text', 'Filter', 'Timer', 'Merge', 'Database', 'Math'];
                const hasConflictInStandard = standardTitles.some((t) => generateHash(t) === newHash);
                const hasConflictInCustom = customNodes.some((node, i) => i !== editingIndex && generateHash(node.title) === newHash);

                if (hasConflictInStandard || hasConflictInCustom) {
                    alert(`Rename blocked: A node type with the name "${tempNode.title}" already exists.`);
                    return;
                }
            }

            // 3. "if there's even a single change delete the main node and replace it with temp one"
            // Replace the main node schema at editingIndex with tempNode
            replaceCustomNode(editingIndex, tempNode);
            alert(`Changes detected. The original node "${originalNode.title}" was replaced with the new custom node configuration.`);
        }

        // Close editing view
        setEditingIndex(null);
    };

    // 4. Cancel button handler to exit modifying screen and delete temp node draft
    const handleCancelEdit = () => {
        setEditingIndex(null);
        alert("Modification canceled. All temporary changes were deleted.");
    };

    // 5. Deletion of custom nodes from the toolbar
    const handleDeleteCustomNode = (index, title) => {
        if (window.confirm(`Are you sure you want to delete the custom node "${title}" from the toolbar?`)) {
            deleteCustomNode(index);
        }
    };

    return (
        <div className="pipeline-toolbar">
            <div className="pipeline-toolbar-header">
                <div className="logo-section">
                    <span className="logo-accent">⚡</span>
                    <h1>VectorShift Node Studio</h1>
                </div>
                <p className="toolbar-subtitle">Build, connect, and analyze your automated data pipelines</p>
            </div>
            
            <div className="pipeline-toolbar-actions">
                <div className="pipeline-toolbar-items">
                    <DraggableNode type='customInput' label='Input' />
                    <DraggableNode type='llm' label='LLM' />
                    <DraggableNode type='customOutput' label='Output' />
                    <DraggableNode type='text' label='Text' />
                    <DraggableNode type='filter' label='Filter' />
                    <DraggableNode type='timer' label='Timer' />
                    <DraggableNode type='merge' label='Merge' />
                    <DraggableNode type='database' label='Database' />
                    <DraggableNode type='math' label='Math' />
                    
                    <button 
                        onClick={() => {
                            setIsCreatorOpen(!isCreatorOpen);
                            setEditingIndex(null); // close editor if open
                        }} 
                        className={`create-node-trigger-btn ${isCreatorOpen ? 'active' : ''}`}
                    >
                        <span className="btn-icon">+</span>
                        <span>Custom Node</span>
                    </button>
                </div>
            </div>

            {/* Collapsible Node Creator Panel */}
            {isCreatorOpen && (
                <form onSubmit={handleSubmit} className="node-creator-panel">
                    <div className="creator-panel-header">
                        <h3>Create Dynamic Node</h3>
                        <p>Instantly construct a reusable React Flow node card schema</p>
                    </div>

                    <div className="creator-grid">
                        <div className="creator-form-group">
                            <label className="node-label">Node Title</label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder="e.g. API Node"
                                className="node-input"
                                required
                            />
                        </div>

                        <div className="creator-form-group">
                            <label className="node-label">Accent Theme Color</label>
                            <div className="color-presets-container">
                                {colorPresets.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`color-preset-pill ${themeColor === color ? 'selected' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setThemeColor(color)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="creator-form-group">
                            <label className="node-label">Inputs (Comma separated handles)</label>
                            <input 
                                type="text" 
                                value={inputsText} 
                                onChange={(e) => setInputsText(e.target.value)} 
                                placeholder="e.g. url, body, headers"
                                className="node-input"
                            />
                        </div>

                        <div className="creator-form-group">
                            <label className="node-label">Outputs (Comma separated handles)</label>
                            <input 
                                type="text" 
                                value={outputsText} 
                                onChange={(e) => setOutputsText(e.target.value)} 
                                placeholder="e.g. response, status"
                                className="node-input"
                            />
                        </div>
                    </div>

                    <div className="creator-actions">
                        <button 
                            type="button" 
                            onClick={() => setIsCreatorOpen(false)}
                            className="creator-cancel-btn"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="creator-submit-btn">
                            Add to Toolbar
                        </button>
                    </div>
                </form>
            )}

            {/* Collapsible Node Editor Panel */}
            {editingIndex !== null && (
                <form onSubmit={handleSaveEdit} className="node-creator-panel edit-mode">
                    <div className="creator-panel-header" style={{ borderBottom: `1px solid ${editThemeColor}50` }}>
                        <h3>Modify Custom Node: <span style={{ color: editThemeColor }}>{customNodes[editingIndex].title}</span></h3>
                        <p>Configure edits to this custom node type, or cancel to discard</p>
                    </div>

                    <div className="creator-grid">
                        <div className="creator-form-group">
                            <label className="node-label">Rename Title</label>
                            <input 
                                type="text" 
                                value={editTitle} 
                                onChange={(e) => setEditTitle(e.target.value)} 
                                className="node-input"
                                required
                            />
                        </div>

                        <div className="creator-form-group">
                            <label className="node-label">Accent Theme Color</label>
                            <div className="color-presets-container">
                                {colorPresets.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`color-preset-pill ${editThemeColor === color ? 'selected' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setEditThemeColor(color)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="creator-form-group">
                            <label className="node-label">Inputs (Comma separated handles)</label>
                            <input 
                                type="text" 
                                value={editInputsText} 
                                onChange={(e) => setEditInputsText(e.target.value)} 
                                className="node-input"
                            />
                        </div>

                        <div className="creator-form-group">
                            <label className="node-label">Outputs (Comma separated handles)</label>
                            <input 
                                type="text" 
                                value={editOutputsText} 
                                onChange={(e) => setEditOutputsText(e.target.value)} 
                                className="node-input"
                            />
                        </div>
                    </div>

                    <div className="creator-actions">
                        <button 
                            type="button" 
                            onClick={handleCancelEdit}
                            className="creator-cancel-btn"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="creator-submit-btn"
                            style={{ background: `linear-gradient(135deg, ${editThemeColor} 0%, #a855f7 100%)` }}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            )}

            {/* Custom Created Nodes Section with Edit & Delete Actions */}
            {customNodes.length > 0 && (
                <div className="custom-nodes-container">
                    <span className="custom-nodes-label">Custom Created Nodes</span>
                    <div className="pipeline-toolbar-items">
                        {customNodes.map((node, index) => (
                            <div key={`custom-node-wrapper-${index}`} className="custom-node-item-wrapper">
                                <DraggableNode 
                                    type="genericCustom" 
                                    label={node.title} 
                                    customNodeData={node} 
                                />
                                <div className="custom-node-item-actions">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setEditingIndex(index);
                                            setEditTitle(node.title);
                                            setEditThemeColor(node.themeColor);
                                            setEditInputsText(node.inputs.join(', '));
                                            setEditOutputsText(node.outputs.join(', '));
                                            setIsCreatorOpen(false); // close creator
                                        }}
                                        title="Edit Node Type Schema"
                                        className="custom-node-action-btn edit"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => handleDeleteCustomNode(index, node.title)}
                                        title="Delete Node Type"
                                        className="custom-node-action-btn delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
