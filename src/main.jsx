import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Girionix AI Root Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07080E] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-2xl font-bold">
            ⚡
          </div>
          <h2 className="text-xl font-bold text-cyan-300 font-mono">Girionix AI — Auto-Recovery Active</h2>
          <p className="text-xs text-gray-400 max-w-md">
            Click below to purge browser cache and launch the sovereign workspace cleanly.
          </p>
          <button 
            onClick={() => {
              try {
                localStorage.clear();
                sessionStorage.clear();
              } catch (_) {}
              window.location.reload();
            }}
            className="px-6 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-all shadow-glow-cyan cursor-pointer"
          >
            Clear Cache & Reload Workspace
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('Captured Global Error:', event.error || event.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Captured Unhandled Rejection:', event.reason);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>,
)

