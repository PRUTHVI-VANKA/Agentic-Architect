import { useState } from 'react';
import { useStore, Draft } from '../state/useStore';
import { CheckCircle, Edit3, RotateCcw } from 'lucide-react';

interface ApprovalPanelProps {
  onApprove: () => void;
  onRevise: (feedback: string) => void;
}

export const ApprovalPanel = ({ onApprove, onRevise }: ApprovalPanelProps) => {
  const draft = useStore(state => state.draft);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDraft, setEditedDraft] = useState(draft);
  const [feedback, setFeedback] = useState('');
  const setDraft = useStore(state => state.setDraft);

  if (!draft) return null;

  const handleSaveEdit = () => {
    if (editedDraft) {
      setDraft(editedDraft);
      setIsEditing(false);
    }
  };

  const handleSectionEdit = (section: keyof Draft['sections'], value: string) => {
    if (editedDraft) {
      setEditedDraft({
        ...editedDraft,
        sections: {
          ...editedDraft.sections,
          [section]: value
        }
      });
    }
  };

  const handleTitleEdit = (value: string) => {
    if (editedDraft) {
      setEditedDraft({
        ...editedDraft,
        title: value
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Human Review Required</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Cancel Edit' : 'Edit Draft'}
          </button>
        </div>

        <div className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editedDraft?.title || ''}
                  onChange={(e) => handleTitleEdit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {editedDraft && Object.entries(editedDraft.sections).map(([key, content]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => handleSectionEdit(key as keyof Draft['sections'], e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
              ))}

              <button
                onClick={handleSaveEdit}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{draft.title}</h3>
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
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Your Decision</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Feedback for Revision (optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide specific feedback if requesting revision..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={onApprove}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors shadow-sm"
            >
              <CheckCircle className="w-5 h-5" />
              Approve & Finalize
            </button>

            <button
              onClick={() => {
                if (feedback.trim()) {
                  onRevise(feedback);
                  setFeedback('');
                } else {
                  alert('Please provide feedback for revision.');
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors shadow-sm"
            >
              <RotateCcw className="w-5 h-5" />
              Request Revision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
