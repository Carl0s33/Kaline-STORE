import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './components/ui/endereco.css';

// Tratamento de erros global
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Algo deu errado</h1>
          <p>{this.state.error?.toString()}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Captura erros não tratados de promessas
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promessa rejeitada não tratada:', event.reason);
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  console.error('Erro não capturado:', event.error);
  event.preventDefault();
});

// Inicializa o root do React
try {
  const container = document.getElementById('root');
  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  
  const container = document.getElementById('root');
  const root = createRoot(container);
  
  root.render(
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Erro ao carregar o aplicativo</h1>
      <p>Por favor, tente recarregar a página ou entre em contato com o suporte.</p>
      <p>Erro: {error.message}</p>
      <button onClick={() => window.location.reload()} style={{
        padding: '0.5rem 1rem',
        fontSize: '1rem',
        cursor: 'pointer',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '0.25rem',
        marginTop: '1rem'
      }}>
        Recarregar Página
      </button>
    </div>
  );
}
