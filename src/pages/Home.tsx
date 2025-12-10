import { useState } from 'react';
import { useStore } from '../state/useStore';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HomeProps {
  onStart: () => void;
}

export const Home = ({ onStart }: HomeProps) => {
  const [localIntent, setLocalIntent] = useState('');
  const setIntent = useStore(state => state.setIntent);

  const handleStart = () => {
    if (localIntent.trim()) {
      setIntent(localIntent);
      onStart();
    }
  };

  const exampleIntents = [
    'Managing anxiety in social situations',
    'Overcoming procrastination and building motivation',
    'Processing grief and loss',
    'Challenging negative self-talk',
    'Building healthy coping mechanisms for stress'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Cerina Protocol Foundry
          </h1>
          <p className="text-lg text-gray-600">
            Multi-Agent CBT Exercise Generator
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="mb-6">
            <label htmlFor="intent" className="block text-sm font-bold text-gray-700 mb-2">
              What therapeutic goal would you like to explore?
            </label>
            <textarea
              id="intent"
              value={localIntent}
              onChange={(e) => setLocalIntent(e.target.value)}
              placeholder="Describe the issue, emotion, or behavioral pattern you'd like to address..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Example intents:</p>
            <div className="space-y-2">
              {exampleIntents.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setLocalIntent(example)}
                  className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-blue-50 text-sm text-gray-700 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={!localIntent.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors shadow-sm"
          >
            Start Protocol Generation
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-bold text-blue-900 mb-2">How it works:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Drafter Agent creates an initial CBT exercise</li>
            <li>Safety Agent scans for potentially harmful content</li>
            <li>Clinical Critic Agent provides feedback on quality and empathy</li>
            <li>Supervisor Agent manages the refinement loop</li>
            <li>You review and approve or request revisions</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
