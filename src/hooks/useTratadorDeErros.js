import { useCallback } from 'react';
import { useNotificacao } from "@/components/ui/useNotificacao";

const useTratadorDeErros = () => {
  const { notificar } = useNotificacao();

  const handleError = useCallback((error, customMessage = null) => {
    console.error('Erro:', error);
    
    const errorMessage = customMessage || 'Não é você, sou eu ;(';
    
    notificar({
      variant: "destructive",
      title: "Ops!",
      description: errorMessage,
      duration: 5000,
    });
    
    return errorMessage;
  }, [notificar]);

  return { handleError };
};

export default useTratadorDeErros;
