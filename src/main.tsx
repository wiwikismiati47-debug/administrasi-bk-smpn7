import { Component, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Override window.confirm and alert to prevent iframe errors in preview
window.confirm = (msg?: string) => {
  console.log('Confirm bypassed in iframe: ' + msg);
  return true;
};
window.alert = (msg?: string) => {
  console.log('Alert bypassed in iframe: ' + msg);
};

// Register Service Worker for PWA with automatic cache updating
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        reg.update();
        console.log('Service Worker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
  });
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Application Error caught by RootErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    try {
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        }).catch(() => {}).finally(() => {
          location.reload();
        });
      } else {
        location.reload();
      }
    } catch {
      location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-5">
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto text-blue-400 font-black text-2xl">
              BK
            </div>
            <h2 className="text-xl font-black text-slate-100">SABDA BK SPANJU</h2>
            <p className="text-sm text-slate-300">
              Sedang memperbarui tampilan aplikasi. Silakan klik tombol di bawah untuk memuat ulang aplikasi.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold rounded-xl text-white shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              Muat Ulang Aplikasi (Refresh)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);

