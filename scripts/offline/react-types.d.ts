// Minimal React type declarations used ONLY for offline type-checking in an
// environment where @types/react cannot be installed. With a normal
// `npm install`, the real @types/react is used instead (see tsconfig.json).
declare module 'react' {
  export type ReactNode = any;
  export type SetState<S> = (v: S | ((prev: S) => S)) => void;
  export function useState<S>(init: S | (() => S)): [S, SetState<S>];
  export function useEffect(fn: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useMemo<T>(fn: () => T, deps: readonly unknown[]): T;
  export function useCallback<T extends (...a: any[]) => any>(fn: T, deps: readonly unknown[]): T;
  export function useRef<T>(init: T): { current: T };
  export interface Context<T> { Provider: (p: { value: T; children?: ReactNode }) => any; _t?: T }
  export function createContext<T>(v: T): Context<T>;
  export function useContext<T>(c: Context<T>): T;
  export const StrictMode: (p: { children?: ReactNode }) => any;
}
declare module 'react-dom/client' {
  export function createRoot(el: Element): { render(n: any): void };
}
declare module 'react/jsx-runtime' {
  export const jsx: any; export const jsxs: any; export const Fragment: any;
  export namespace JSX {
    interface Element {}
    interface IntrinsicElements { [k: string]: {
      onChange?: (e: { target: any; currentTarget: any }) => void;
      onSubmit?: (e: { preventDefault(): void }) => void;
      [prop: string]: any } }
    interface IntrinsicAttributes { key?: string | number }
  }
}
declare module '*.css';
