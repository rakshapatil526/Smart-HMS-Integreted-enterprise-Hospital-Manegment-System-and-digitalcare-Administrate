import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Smart Care HMIS Uncaught Error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    localStorage.removeItem('smartcare_access_token');
    localStorage.removeItem('smartcare_user_session');
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-['Inter',sans-serif]">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 mx-auto border border-amber-500/30">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-white">Smart Care HMIS System Recovery</h1>
              <p className="text-xs text-slate-400 mt-2">
                An unexpected module runtime exception was intercepted. Your session data remains safe.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-950 p-4 rounded-xl text-left text-xs font-mono text-rose-300 border border-rose-900/40 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white py-3 text-xs font-bold transition-all shadow-md"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 py-3 text-xs font-bold transition-all"
              >
                <Home className="h-4 w-4" />
                <span>Reset Session</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
