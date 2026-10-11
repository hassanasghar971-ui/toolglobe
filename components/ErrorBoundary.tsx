// components/ErrorBoundary.tsx
// Global client-side crash boundary. Prevents a single broken tool execution
// from taking down the entire 20,000+ route SPA shell.

"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[ToolGlobe ErrorBoundary]", error.message, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="glass-card mx-auto my-12 max-w-md p-8 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-lg font-semibold text-white mb-2">Something went wrong</h2>
          <p className="text-sm text-white/60 mb-5">
            This tool hit an unexpected error. Nothing was sent anywhere unsafe — try again below.
          </p>
          <button
            onClick={this.handleReset}
            className="glow-border px-5 py-2 rounded-xl text-sm font-medium text-white hover:scale-105 transition-transform"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
