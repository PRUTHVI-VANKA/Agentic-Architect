import { Draft, SafetyFlag, CriticNote } from '../state/useStore';

const unsafeKeywords = ['hurt', 'kill', 'harm', 'death', 'suicide', 'die', 'weapon', 'violence'];

export const drafterAgent = async (intent: string): Promise<Draft> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const draft: Draft = {
    title: `CBT Exercise: ${intent.slice(0, 50)}`,
    sections: {
      introduction: `This cognitive behavioral therapy exercise is designed to help you explore: ${intent}.

Through this structured approach, you'll identify thought patterns, challenge negative beliefs, and develop healthier coping strategies. Remember, this is a safe space for self-reflection and growth.`,

      cognitiveRestructuring: `1. Identify the triggering situation related to: ${intent}
2. Notice your automatic thoughts - what immediately comes to mind?
3. Examine the evidence for and against these thoughts
4. Consider alternative perspectives: What would you tell a friend in this situation?
5. Develop a balanced thought that acknowledges reality while promoting wellness`,

      behavioralActivation: `Let's create an action plan:

- Small step 1: Identify one activity that brings you joy or meaning
- Small step 2: Schedule this activity for a specific time this week
- Small step 3: Notice your mood before and after the activity
- Small step 4: Gradually increase engagement with positive activities

Remember: Start small, be consistent, and celebrate progress.`,

      exposure: `If your concern involves anxiety or avoidance:

1. Create a fear hierarchy (rate situations from 1-10)
2. Start with lower-anxiety situations
3. Practice staying in the situation until anxiety naturally decreases
4. Use breathing techniques: 4 counts in, 4 counts hold, 6 counts out
5. Gradually work up the hierarchy at your own pace

This process teaches your brain that the feared situation is manageable.`,

      reflection: `After completing this exercise, take time to reflect:

- What patterns did you notice in your thinking?
- Which strategies felt most helpful?
- What did you learn about yourself?
- What would you like to continue practicing?
- What support might you need moving forward?

Remember: Change takes time. Be patient and compassionate with yourself throughout this journey.`
    }
  };

  return draft;
};

export const safetyAgent = async (draft: Draft): Promise<SafetyFlag[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const flags: SafetyFlag[] = [];
  const allText = Object.values(draft.sections).join(' ').toLowerCase();

  for (const keyword of unsafeKeywords) {
    const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
    const matches = allText.match(regex);

    if (matches) {
      const contextStart = allText.indexOf(keyword.toLowerCase());
      const context = allText.slice(Math.max(0, contextStart - 30), contextStart + 30);

      flags.push({
        keyword,
        context,
        severity: ['kill', 'suicide', 'weapon'].includes(keyword) ? 'high' :
                 ['hurt', 'harm', 'death'].includes(keyword) ? 'medium' : 'low'
      });
    }
  }

  if (allText.length < 200) {
    flags.push({
      keyword: 'insufficient_content',
      context: 'Draft is too brief',
      severity: 'medium'
    });
  }

  return flags;
};

export const criticAgent = async (draft: Draft, safetyFlags: SafetyFlag[]): Promise<CriticNote[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const notes: CriticNote[] = [];

  if (draft.sections.introduction.length < 100) {
    notes.push({
      section: 'introduction',
      suggestion: 'Introduction could be more detailed. Consider adding more context about the therapeutic approach.',
      priority: 'medium'
    });
  }

  const empathyWords = ['you', 'your', 'feel', 'experience', 'journey'];
  const hasEmpathy = empathyWords.some(word =>
    Object.values(draft.sections).join(' ').toLowerCase().includes(word)
  );

  if (!hasEmpathy) {
    notes.push({
      section: 'overall',
      suggestion: 'Add more empathetic language. Use "you" statements and acknowledge the user\'s emotional experience.',
      priority: 'high'
    });
  }

  if (!draft.sections.reflection.includes('?')) {
    notes.push({
      section: 'reflection',
      suggestion: 'Add reflective questions to encourage deeper self-exploration.',
      priority: 'medium'
    });
  }

  if (safetyFlags.length > 0) {
    notes.push({
      section: 'safety',
      suggestion: `Safety concerns detected (${safetyFlags.length} flags). Review content for potentially harmful language.`,
      priority: 'high'
    });
  }

  if (draft.sections.behavioralActivation.split('\n').length < 5) {
    notes.push({
      section: 'behavioralActivation',
      suggestion: 'Behavioral activation section needs more actionable steps.',
      priority: 'low'
    });
  }

  return notes;
};

export const supervisorCheck = (
  iteration: number,
  safetyFlags: SafetyFlag[],
  criticNotes: CriticNote[]
): { shouldContinue: boolean; reason: string } => {

  if (iteration >= 5) {
    return {
      shouldContinue: false,
      reason: 'Maximum iterations reached. Pausing for human review.'
    };
  }

  const highPriorityIssues = [
    ...safetyFlags.filter(f => f.severity === 'high'),
    ...criticNotes.filter(n => n.priority === 'high')
  ];

  if (highPriorityIssues.length === 0 && (safetyFlags.length + criticNotes.length) <= 2) {
    return {
      shouldContinue: false,
      reason: 'Quality threshold met. Draft ready for human review.'
    };
  }

  if (iteration > 0 && (safetyFlags.length + criticNotes.length) <= 3) {
    return {
      shouldContinue: false,
      reason: 'Acceptable quality reached. Pausing for human approval.'
    };
  }

  return {
    shouldContinue: true,
    reason: 'Issues detected. Continuing refinement loop.'
  };
};
