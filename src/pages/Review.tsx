import { useStore } from '../state/useStore';
import { ApprovalPanel } from '../components/ApprovalPanel';
import { AgentLogs } from '../components/AgentLogs';
import { UserCheck } from 'lucide-react';

interface ReviewProps {
  onApprove: () => void;
  onRevise: () => void;
}

export const Review = ({ onApprove, onRevise }: ReviewProps) => {
  const intent = useStore(state => state.intent);
  const iteration = useStore(state => state.iteration);
  const addLog = useStore(state => state.addLog);
  const setStatus = useStore(state => state.setStatus);

  const handleApprove = () => {
    addLog({
      agent: 'System',
      message: 'Human approved the protocol. Finalizing...',
      type: 'success'
    });
    setStatus('final');
    onApprove();
  };

  const handleRevise = (feedback: string) => {
    addLog({
      agent: 'System',
      message: `Human requested revision: ${feedback}`,
      type: 'info'
    });
    addLog({
      agent: 'System',
      message: 'Restarting agent refinement cycle...',
      type: 'info'
    });
    setStatus('drafting');
    onRevise();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Human Review</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Intent: {intent}
                  </p>
                </div>
              </div>
              <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-lg">
                After {iteration} iteration{iteration !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ApprovalPanel onApprove={handleApprove} onRevise={handleRevise} />
          </div>

          <div className="h-[calc(100vh-180px)]">
            <AgentLogs />
          </div>
        </div>
      </div>
    </div>
  );
};
