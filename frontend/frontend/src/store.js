// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

// Hash function helper (DJB2 algorithm)
export const generateHash = (str) => {
  if (!str) return '0';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
};

// Helper to extract the unique descriptive name of a node
export const getNodeName = (node) => {
  if (!node) return '';
  if (node.type === 'customInput') return node.data?.inputName || node.id;
  if (node.type === 'customOutput') return node.data?.outputName || node.id;
  return node.data?.title || node.id;
};

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    customNodes: [],
    theme: 'dark',
    toggleTheme: () => {
      const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
      if (nextTheme === 'light') {
        document.body.classList.add('theme-light');
      } else {
        document.body.classList.remove('theme-light');
      }
      set({ theme: nextTheme });
    },
    addCustomNode: (nodeSchema) => {
      const newHash = generateHash(nodeSchema.title);
      
      // Prevent duplicate custom node names in toolbar
      const standardTitles = ['Input', 'LLM', 'Output', 'Text', 'Filter', 'Timer', 'Merge', 'Database', 'Math'];
      const hasConflictInStandard = standardTitles.some((title) => generateHash(title) === newHash);
      const hasConflictInCustom = get().customNodes.some((node) => generateHash(node.title) === newHash);
      
      if (hasConflictInStandard || hasConflictInCustom) {
        alert(`Toolbar node creation blocked: A node type with the name "${nodeSchema.title}" (Hash: ${newHash}) already exists.`);
        return;
      }

      set({
          customNodes: [...get().customNodes, nodeSchema]
      });
    },
    deleteCustomNode: (index) => {
        set({
            customNodes: get().customNodes.filter((_, i) => i !== index)
        });
    },
    replaceCustomNode: (index, newNodeSchema) => {
        set({
            customNodes: get().customNodes.map((node, i) => i === index ? newNodeSchema : node)
        });
    },
    deleteSelected: () => {
        const selectedNodeIds = get().nodes.filter((node) => node.selected).map((node) => node.id);
        set({
            nodes: get().nodes.filter((node) => !node.selected),
            edges: get().edges.filter(
                (edge) => !edge.selected && !selectedNodeIds.includes(edge.source) && !selectedNodeIds.includes(edge.target)
            ),
        });
    },
    selectNodesInArea: (pointA, pointB) => {
        const minX = Math.min(pointA.x, pointB.x);
        const maxX = Math.max(pointA.x, pointB.x);
        const minY = Math.min(pointA.y, pointB.y);
        const maxY = Math.max(pointA.y, pointB.y);

        set({
            nodes: get().nodes.map((node) => {
                const { x, y } = node.position;
                const isInside = x >= minX && x <= maxX && y >= minY && y <= maxY;
                return { ...node, selected: isInside };
            }),
        });
    },
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        const newName = getNodeName(node);
        const newHash = generateHash(newName);

        // Check for node name conflict on the canvas
        const hasConflict = get().nodes.some((n) => {
          const existingName = getNodeName(n);
          return generateHash(existingName) === newHash;
        });

        if (hasConflict) {
          alert(`Node creation blocked: A node with the name "${newName}" (Hash: ${newHash}) already exists on the canvas.`);
          return;
        }

        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      // If renaming inputName, outputName, or title, validate uniqueness via hashes
      if (fieldName === 'inputName' || fieldName === 'outputName' || fieldName === 'title') {
        const newHash = generateHash(fieldValue);
        const hasConflict = get().nodes.some((n) => {
          if (n.id === nodeId) return false; // Ignore self
          const existingName = getNodeName(n);
          return generateHash(existingName) === newHash;
        });

        if (hasConflict) {
          alert(`Rename blocked: A node with the name "${fieldValue}" (Hash: ${newHash}) already exists.`);
          return;
        }
      }

      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
      });
    },
  }));
