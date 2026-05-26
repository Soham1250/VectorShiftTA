import { DraggableNode } from './draggableNode';
import { useStore } from './store';

export const PipelineToolbar = () => {
    const theme = useStore((state) => state.theme);
    const toggleTheme = useStore((state) => state.toggleTheme);

    return (
        <div className="pipeline-toolbar">
            <div className="pipeline-toolbar-header-row">
                <div className="pipeline-toolbar-header">
                    <div className="logo-section">
                        <span className="logo-accent">⚡</span>
                        <h1>VectorShift <em>Node Studio</em></h1>
                    </div>
                    <p className="toolbar-subtitle">Build, connect, and analyze your automated data pipelines</p>
                </div>
                <button className="theme-toggle-btn" onClick={toggleTheme} title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
                    {theme === 'light' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5"/>
                            <line x1="12" y1="1" x2="12" y2="3"/>
                            <line x1="12" y1="21" x2="12" y2="23"/>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                            <line x1="1" y1="12" x2="3" y2="12"/>
                            <line x1="21" y1="12" x2="23" y2="12"/>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                    )}
                </button>
            </div>
            
            <div className="pipeline-toolbar-actions">
                <div className="pipeline-toolbar-items">
                    <DraggableNode type='customInput' label='Input' />
                    <DraggableNode type='llm' label='LLM' />
                    <DraggableNode type='customOutput' label='Output' />
                    <DraggableNode type='text' label='Text' />
                    <DraggableNode type='delay' label='Delay' />
                    <DraggableNode type='conditional' label='Conditional' />
                    <DraggableNode type='sqlQuery' label='SQL Query' />
                    <DraggableNode type='skip' label='Skip' />
                    <DraggableNode type='updateMemory' label='Memory' />
                </div>
            </div>
        </div>
    );
};
