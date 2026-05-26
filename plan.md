# Refactored Approach: Modular Base Node Abstraction

This document outlines the step-wise refactoring plan to build a configuration-driven React Flow node architecture.

---

## 📋 Step-wise Action Items & Progress Checklist

### Step 1: BaseNode Core Abstraction Component
- [x] Refactor `BaseNode.js` to accept `id`, `title`, `icon`, `themeColor` (accent color), `inputs` (array of target handle IDs/configs), `outputs` (array of source handle IDs/configs), and `children`.
- [x] Implement equal-spacing vertical placement algorithms for dynamic target and source Handles on the left and right boundaries of the card.
- [x] Ensure each Handle has a robust, unique ID formatted as `${id}-${handleName}`.

### Step 2: Refactor the 4 Core Nodes to use BaseNode
- [x] Refactor `inputNode.js` to extend `BaseNode` using the configuration API.
- [x] Refactor `llmNode.js` to extend `BaseNode` using the configuration API.
- [x] Refactor `outputNode.js` to extend `BaseNode` using the configuration API.
- [x] Refactor `textNode.js` to extend `BaseNode` and dynamically update its `inputs` handle config list as variables are typed.

### Step 3: Implement 5 Specific Custom Nodes
- [x] Create `filterNode.js` (multiple text variables as target handles, one formatted prompt string source handle).
- [x] Create `timerNode.js` (styled for database management; data vector inputs, search query outputs).
- [x] Create `mergeNode.js` (URL/Payload target handles, Response/Error source handles).
- [x] Create `databaseNode.js` (system-prompt text field, execution routing handles).
- [x] Create `mathNode.js` (workflow branching; incoming data handle split into "True" and "False" source paths).

### Step 4: Verification and Run
- [x] Ensure all node registrations in `ui.js` and `toolbar.js` align with the new specifications.
- [x] Verify hot-reloading compiles without errors and test graph submissions.

### Step 5: Node Deletion functionality
- [x] Add explicit `deleteKeyCode={["Backspace", "Delete"]}` configuration to the ReactFlow canvas component in `ui.js` to support keyboard deletions.
- [x] Implement the `deleteSelected` action in the Zustand store (`store.js`) to remove selected nodes, selected edges, and clean up orphan edges.
- [x] Integrate a **"Delete Selected"** crimson button next to the Submit button in `submit.js` that automatically enables when any node or edge is selected on the canvas.
- [x] Style the delete button with visual warning presets and inactive states in `index.css`.

### Step 6: Drag Selection & Unique Node Naming via Hashes
- [x] Configure left-click mouse dragging selection box on ReactFlow canvas (`selectionOnDrag={true}`, `selectionMode="partial"`) in `ui.js`.
- [x] Re-route canvas panning to middle-click (mouse scroll wheel) and right-click dragging (`panOnDrag={[1, 2]}`) in `ui.js`.
- [x] Pre-populate initial default names and titles in `getInitNodeData` inside `ui.js` before nodes are added.
- [x] Write `generateHash` helper (DJB2 hashing algorithm) and `getNodeName` mapping functions in `store.js`.
- [x] Implement unique name verification checks using hashes in the `addNode` store action (to block duplicate canvas drops).
- [x] Implement name uniqueness checks inside the `updateNodeField` store action (to prevent duplicates via renames).
- [x] Enforce unique toolbar category creation checks using hashes in the `addCustomNode` store action.

### Step 7: Programmatic Bounding Box Multi-Node Area Selection
- [x] Implement `selectNodesInArea(pointA, pointB)` utility action in the Zustand store (`store.js`) to programmatically calculate bounding boxes and select intersecting nodes in code.

### Step 8: Custom Toolbar Node Modifying & Deletion
- [x] Add `deleteCustomNode` and `replaceCustomNode` actions inside the Zustand store (`store.js`).
- [x] Integrate small action buttons (pencil to edit, trashcan to delete) next to custom nodes in toolbar.js.
- [x] Implement a collapsible "Modify Custom Node" panel bound to temporary state variable inputs.
- [x] Build comparison logic checking if any properties changed: if identical, delete the temporary edit draft and keep the main node; if changes exist, delete the main node and replace it with the edited configuration.
- [x] Add a cancel button to close the modification panel, safely discarding all temporary edits.
- [x] Design micro-interactions in index.css so action buttons fade in smoothly upon hovering over custom nodes.

### Step 9: Mandatory Node Naming & Copy-Paste Duplication (New)
- [x] Modify the dropped node creation in `onDrop` inside `ui.js` to prompt developers to provide a name, enforcing that the name is mandatory and unique using the DJB2 hashing infrastructure.
- [x] Add a keypress copy-paste event listener (`Ctrl + C` / `Ctrl + V`) in `ui.js` that duplicates selected canvas nodes.
- [x] Enforce unique node naming upon pasting by querying the user for a unique name and validating it against existing nodes' hashes.
- [x] Automatically offset the pasted node's position by `+40px, +40px` to prevent overlaps.
