import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import '@/index.css';

const container = document.getElementById('root');
const root = createRoot(container);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Algo deu errado!</h1>
          <p>Por favor, recarregue a página ou tente novamente mais tarde.</p>
          <button onClick={() => window.location.reload()} style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            cursor: 'pointer',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
          }}>
            Recarregar Página
          </button>
          <pre style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.25rem',
            textAlign: 'left',
            overflowX: 'auto',
            maxWidth: '100%',
          }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const handleError = (error) => {
  console.error('Erro não tratado:', error);
};

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promessa rejeitada não tratada:', event.reason);
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  console.error('Erro não capturado:', event.error);
  event.preventDefault();
});

try {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  handleError(error);
  

  root.render(
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Erro ao carregar o aplicativo</h1>
      <p>Por favor, tente recarregar a página ou entre em contato com o suporte.</p>
      <button onClick={() => window.location.reload()} style={{
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        cursor: 'pointer',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '0.25rem',
      }}>
        Recarregar Página
      </button>
    </div>
  );
}
