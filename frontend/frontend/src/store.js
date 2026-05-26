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
    theme: localStorage.getItem('theme') || 'light',
    toggleTheme: () => {
      const newTheme = get().theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      set({ theme: newTheme });
    },
    alert: null,
    showAlert: (title, message, type = 'warning') => set({ alert: { title, message, type } }),
    hideAlert: () => set({ alert: null }),
    prompt: null,
    showPrompt: (title, message, defaultValue, onConfirm, onCancel) => set({ prompt: { title, message, defaultValue, onConfirm, onCancel } }),
    hidePrompt: () => set({ prompt: null }),
    nodes: [],
    edges: [],
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
          get().showAlert(
            "Node Creation Blocked",
            `A node with the name "${newName}" already exists on the canvas. Please choose a unique name.`,
            "warning"
          );
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
          get().showAlert(
            "Rename Blocked",
            `A node with the name "${fieldValue}" already exists. Please choose a unique name.`,
            "warning"
          );
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
