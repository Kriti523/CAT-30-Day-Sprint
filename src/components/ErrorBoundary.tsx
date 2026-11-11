import { Component, type ErrorInfo, type ReactNode } from 'react';
import { reportError } from '../lib/errors';

/** Catches a crash anywhere below it, reports it and offers a reload instead of a blank page. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() { return { failed: true }; }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(Object.assign(error, { stack: `${error.stack ?? ''}\n--- component stack ---${info.componentStack ?? ''}` }), 'react');
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="panel lift max-w-md p-6 text-center">
          <div className="display text-2xl font-bold">Something went wrong</div>
          <p className="mt-2 text-muted">Your progress is safe: it's saved on this device and to your account. Reloading usually fixes this.</p>
          <div className="mt-5 flex justify-center gap-2">
            <button className="btn btn-primary" onClick={() => window.location.reload()}>Reload</button>
            <a className="btn" href="./">Go to start</a>
          </div>
        </div>
      </div>
    );
  }
}
