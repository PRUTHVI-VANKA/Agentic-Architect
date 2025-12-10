import { create } from 'zustand';

export interface Log {
  timestamp: Date;
  agent: 'Drafter' | 'Safety' | 'Critic' | 'Supervisor' | 'System';
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface SafetyFlag {
  keyword: string;
  context: string;
  severity: 'low' | 'medium' | 'high';
}

export interface CriticNote {
  section: string;
  suggestion: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Draft {
  title: string;
  sections: {
    introduction: string;
    cognitiveRestructuring: string;
    behavioralActivation: string;
    exposure: string;
    reflection: string;
  };
}

interface AppState {
  intent: string;
  draft: Draft | null;
  previousDrafts: Draft[];
  logs: Log[];
  safetyFlags: SafetyFlag[];
  criticNotes: CriticNote[];
  iteration: number;
  status: 'idle' | 'drafting' | 'paused' | 'final';
  currentPage: 'home' | 'processing' | 'review' | 'final';

  setIntent: (intent: string) => void;
  setDraft: (draft: Draft) => void;
  addLog: (log: Omit<Log, 'timestamp'>) => void;
  addSafetyFlag: (flag: SafetyFlag) => void;
  addCriticNote: (note: CriticNote) => void;
  clearFlags: () => void;
  clearNotes: () => void;
  incrementIteration: () => void;
  setStatus: (status: AppState['status']) => void;
  setCurrentPage: (page: AppState['currentPage']) => void;
  archiveDraft: () => void;
  reset: () => void;
}

const initialState = {
  intent: '',
  draft: null,
  previousDrafts: [],
  logs: [],
  safetyFlags: [],
  criticNotes: [],
  iteration: 0,
  status: 'idle' as const,
  currentPage: 'home' as const,
};

export const useStore = create<AppState>((set) => ({
  ...initialState,

  setIntent: (intent) => set({ intent }),

  setDraft: (draft) => set({ draft }),

  addLog: (log) => set((state) => ({
    logs: [...state.logs, { ...log, timestamp: new Date() }]
  })),

  addSafetyFlag: (flag) => set((state) => ({
    safetyFlags: [...state.safetyFlags, flag]
  })),

  addCriticNote: (note) => set((state) => ({
    criticNotes: [...state.criticNotes, note]
  })),

  clearFlags: () => set({ safetyFlags: [] }),

  clearNotes: () => set({ criticNotes: [] }),

  incrementIteration: () => set((state) => ({ iteration: state.iteration + 1 })),

  setStatus: (status) => set({ status }),

  setCurrentPage: (currentPage) => set({ currentPage }),

  archiveDraft: () => set((state) => ({
    previousDrafts: state.draft ? [...state.previousDrafts, state.draft] : state.previousDrafts
  })),

  reset: () => set(initialState),
}));
