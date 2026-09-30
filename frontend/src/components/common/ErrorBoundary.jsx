import React from "react";
import { AlertCircle, RefreshCw, Home, Sparkles } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ScholarLink Application Error Boundary Caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    localStorage.removeItem("scholarlink_token");
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 bg-slate-50">
          <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>ScholarLink Session Restorer</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {this.props.title || "Interface Recovery Notice"}
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                The portal encountered a temporary state sync issue while rendering this section. Your profile data and verified records remain completely safe.
              </p>
            </div>

            {/* Diagnostic Message */}
            {this.state.error && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-left font-mono text-[11px] text-slate-700 overflow-x-auto max-h-28">
                <span className="font-bold text-rose-600 block mb-1">Diagnostic Detail:</span>
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
