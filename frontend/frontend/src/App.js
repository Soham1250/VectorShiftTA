import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { AlertModal } from './alertModal';
import { PromptModal } from './promptModal';

function App() {
  return (
    <div>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
      <AlertModal />
      <PromptModal />
    </div>
  );
}

export default App;
