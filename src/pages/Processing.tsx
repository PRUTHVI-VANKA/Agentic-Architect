import { useEffect } from 'react';
import { useStore } from '../state/useStore';
import { AgentLogs } from '../components/AgentLogs';
import { DraftViewer } from '../components/DraftViewer';
import { drafterAgent, safetyAgent, criticAgent, supervisorCheck } from '../agents/simulator';
import { Loader2 } from 'lucide-react';

interface ProcessingProps {
  onComplete: () => void;
}

export const Processing = ({ onComplete }: ProcessingProps) => {
  const intent = useStore(state => state.intent);
  const iteration = useStore(state => state.iteration);
  const status = useStore(state => state.status);
  const addLog = useStore(state => state.addLog);
  const setDraft = useStore(state => state.setDraft);
  const addSafetyFlag = useStore(state => state.addSafetyFlag);
  const addCriticNote = useStore(state => state.addCriticNote);
  const clearFlags = useStore(state => state.clearFlags);
  const clearNotes = useStore(state => state.clearNotes);
  const incrementIteration = useStore(state => state.incrementIteration);
  const setStatus = useStore(state => state.setStatus);
  const archiveDraft = useStore(state => state.archiveDraft);

  useEffect(() => {
    if (status === 'drafting') {
      runAgentCycle();
    }
  }, [status, iteration]);

  const runAgentCycle = async () => {
    incrementIteration();
    const currentIteration = iteration + 1;

    addLog({
      agent: 'System',
      message: `Starting iteration ${currentIteration}`,
      type: 'info'
    });

    addLog({
      agent: 'Drafter',
      message: 'Generating CBT exercise draft...',
      type: 'info'
    });

    const draft = await drafterAgent(intent);
    setDraft(draft);
    archiveDraft();

    addLog({
      agent: 'Drafter',
      message: 'Draft generated successfully',
      type: 'success'
    });

    clearFlags();
    addLog({
      agent: 'Safety',
      message: 'Analyzing draft for safety concerns...',
      type: 'info'
    });

    const flags = await safetyAgent(draft);
    flags.forEach(flag => addSafetyFlag(flag));

    if (flags.length > 0) {
      addLog({
        agent: 'Safety',
        message: `Found ${flags.length} safety flag(s)`,
        type: 'warning'
      });
    } else {
      addLog({
        agent: 'Safety',
        message: 'No safety concerns detected',
        type: 'success'
      });
    }

    clearNotes();
    addLog({
      agent: 'Critic',
      message: 'Evaluating clinical quality and empathy...',
      type: 'info'
    });

    const notes = await criticAgent(draft, flags);
    notes.forEach(note => addCriticNote(note));

    if (notes.length > 0) {
      addLog({
        agent: 'Critic',
        message: `Generated ${notes.length} improvement suggestion(s)`,
        type: 'info'
      });
    } else {
      addLog({
        agent: 'Critic',
        message: 'Draft meets quality standards',
        type: 'success'
      });
    }

    addLog({
      agent: 'Supervisor',
      message: 'Evaluating whether to continue refinement or pause for human review...',
      type: 'info'
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    const decision = supervisorCheck(currentIteration, flags, notes);

    addLog({
      agent: 'Supervisor',
      message: decision.reason,
      type: decision.shouldContinue ? 'info' : 'success'
    });

    if (decision.shouldContinue) {
      addLog({
        agent: 'System',
        message: 'Initiating next refinement cycle...',
        type: 'info'
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('drafting');
    } else {
      addLog({
        agent: 'System',
        message: 'Protocol ready for human review',
        type: 'success'
      });
      setStatus('paused');

      await new Promise(resolve => setTimeout(resolve, 1000));
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Agent Processing</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Intent: {intent}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="text-sm font-semibold text-blue-900">
                    Processing...
                  </span>
                </div>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg">
                  Iteration {iteration}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
          <AgentLogs />
          <DraftViewer />
        </div>
      </div>
    </div>
  );
};
