import React from 'react';
import { AlertTriangle, RotateCcw, Download } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const STORAGE_KEY = 'incident_resource_preposition_plan_v4';

/**
 * Top-level safety net.
 *
 * Without this, any uncaught exception anywhere in the render tree (a bad
 * marker loaded from localStorage, a Leaflet call throwing on malformed
 * geometry, etc.) unmounts the ENTIRE app with no message — which looks
 * exactly like "the map disappeared". This boundary catches that, shows a
 * recoverable screen instead of a blank page, and gives the user a way to
 * back up or clear their saved plan without losing everything silently.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Application crashed:', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleExportAndClear = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(saved);
        const a = document.createElement('a');
        a.setAttribute('href', dataStr);
        a.setAttribute('download', 'recovered_plan_backup.json');
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (e) {
      console.error('Failed to export backup during crash recovery:', e);
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-slate-950 text-slate-100 p-6 text-center">
          <div className="max-w-md space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-red-950 border border-red-800 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <h1 className="text-lg font-bold text-white">Something went wrong loading the map</h1>
            <p className="text-sm text-slate-400">
              The app hit an unexpected error and had to stop rendering, most likely caused by
              corrupted or incompatible saved plan data. Your saved plan is still in this
              browser's storage — you can back it up before clearing it.
            </p>
            {this.state.error && (
              <pre className="text-left text-[10px] text-red-300 bg-slate-900 border border-slate-800 rounded p-2 overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reload
              </button>
              <button
                onClick={this.handleExportAndClear}
                className="flex items-center gap-1.5 text-xs font-semibold bg-red-900/60 hover:bg-red-800 border border-red-800 text-red-100 px-3 py-2 rounded-lg"
              >
                <Download className="w-3.5 h-3.5" /> Backup &amp; Clear Saved Plan
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
