import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { Botao } from '@/components/ui/botao';
import { AlertCircle, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
          <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Não é você, sou eu ;(
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Algo inesperado aconteceu. Por favor, tente novamente mais tarde.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Botao 
                onClick={() => window.location.reload()}
                className="bg-brand-primary-kaline hover:bg-brand-primary-kaline/90"
              >
                Recarregar página
              </Botao>
              <Botao 
                asChild 
                variant="outline"
              >
                <a href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Página inicial
                </a>
              </Botao>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
