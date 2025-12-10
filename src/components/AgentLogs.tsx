import { useStore } from '../state/useStore';
import { Activity, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const AgentLogs = () => {
  const logs = useStore(state => state.logs);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'Drafter':
        return 'text-blue-600 font-semibold';
      case 'Safety':
        return 'text-red-600 font-semibold';
      case 'Critic':
        return 'text-purple-600 font-semibold';
      case 'Supervisor':
        return 'text-green-600 font-semibold';
      default:
        return 'text-gray-600 font-semibold';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
        <Activity className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-900">Agent Activity Logs</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {logs.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No activity yet...</p>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className="flex gap-3 p-3 bg-gray-50 rounded border-l-4 border-gray-300 hover:bg-gray-100 transition-colors"
              style={{
                borderLeftColor:
                  log.agent === 'Drafter' ? '#2563eb' :
                  log.agent === 'Safety' ? '#dc2626' :
                  log.agent === 'Critic' ? '#9333ea' :
                  log.agent === 'Supervisor' ? '#16a34a' : '#6b7280'
              }}
            >
              <div className="mt-0.5">
                {getIcon(log.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={getAgentColor(log.agent)}>
                    {log.agent}
                  </span>
                  <span className="text-xs text-gray-500">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{log.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
