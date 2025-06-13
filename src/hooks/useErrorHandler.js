import { useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";

const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((error, customMessage = null) => {
    console.error('Erro:', error);
    
    const errorMessage = customMessage || 'Não é você, sou eu ;(';
    
    toast({
      variant: "destructive",
      title: "Ops!",
      description: errorMessage,
      duration: 5000,
    });
    
    return errorMessage;
  }, [toast]);

  return { handleError };
};

export default useErrorHandler;
