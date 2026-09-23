import { createContext, useContext } from 'react';
import type { Section } from '../types';

export type Page = 'dashboard' | 'plan' | 'bank' | 'practice' | 'tests' | 'errors' | 'trends' | 'priorities' | 'formulas' | 'mocks' | 'strategy' | 'sources' | 'data';

export interface Session { ids: string[]; title: string; timed: boolean; index: number }

export interface Nav {
  page: Page;
  go: (p: Page, opts?: { bankSection?: Section; bankQuery?: string; testSection?: Section | 'FULL' }) => void;
  startSession: (ids: string[], title: string, timed?: boolean) => void;
  bankSection: Section;
  bankQuery: string;
  pendingTest: Section | 'FULL' | null;
  clearPendingTest: () => void;
}

export const NavCtx = createContext<Nav | null>(null);
export function useNav() {
  const n = useContext(NavCtx);
  if (!n) throw new Error('Nav missing');
  return n;
}
