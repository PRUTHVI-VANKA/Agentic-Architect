import { useStore } from '../state/useStore';
import { FileText, AlertCircle } from 'lucide-react';

export const DraftViewer = () => {
  const draft = useStore(state => state.draft);
  const safetyFlags = useStore(state => state.safetyFlags);
  const criticNotes = useStore(state => state.criticNotes);
  const iteration = useStore(state => state.iteration);

  if (!draft) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex items-center justify-center">
        <p className="text-gray-400 italic">No draft generated yet...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-bold text-gray-900">Current Draft</h2>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
          Iteration {iteration}
        </span>
      </div>

      {(safetyFlags.length > 0 || criticNotes.length > 0) && (
        <div className="mb-4 space-y-2">
          {safetyFlags.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-red-900">
                  Safety Flags ({safetyFlags.length})
                </span>
              </div>
              <div className="space-y-1">
                {safetyFlags.map((flag, idx) => (
                  <div key={idx} className="text-xs text-red-700">
                    <span className="font-semibold">{flag.keyword}</span>
                    <span className="ml-2 px-2 py-0.5 bg-red-200 rounded">
                      {flag.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {criticNotes.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">
                  Critic Notes ({criticNotes.length})
                </span>
              </div>
              <div className="space-y-1">
                {criticNotes.map((note, idx) => (
                  <div key={idx} className="text-xs text-purple-700">
                    <span className="font-semibold">{note.section}:</span> {note.suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{draft.title}</h3>
        </div>

        {Object.entries(draft.sections).map(([key, content]) => (
          <div key={key} className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              {content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
