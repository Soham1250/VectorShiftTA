from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# Add CORS Middleware to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PipelineData(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(data: PipelineData):
    nodes = data.nodes
    edges = data.edges
    
    num_nodes = len(nodes)
    num_edges = len(edges)
    
    # Build adjacency list
    adj = {node['id']: [] for node in nodes}
    
    # Handle edges safely
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source and target:
            if source not in adj:
                adj[source] = []
            if target not in adj:
                adj[target] = []
            adj[source].append(target)
            
    # DFS-based cycle detection (3-state: 0=unvisited, 1=visiting, 2=visited)
    state = {node_id: 0 for node_id in adj}
    
    def has_cycle(u: str) -> bool:
        state[u] = 1  # visiting
        for v in adj[u]:
            v_state = state.get(v, 0)
            if v_state == 1:
                return True  # Found a back edge (cycle)
            elif v_state == 0:
                if has_cycle(v):
                    return True
        state[u] = 2  # visited
        return False

    is_dag = True
    for node_id in list(adj.keys()):
        if state[node_id] == 0:
            if has_cycle(node_id):
                is_dag = False
                break

    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag
    }
