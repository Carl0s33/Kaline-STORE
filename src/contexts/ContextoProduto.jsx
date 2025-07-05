import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import * as produtosData from '@/data/produtos.js';
import { useNotificacao } from "@/components/ui/useNotificacao";

// Extrai os dados iniciais corretamente
const produtosIniciais = Array.isArray(produtosData.default) ? produtosData.default : [];
const inicializarProdutosComImagensBase64 = produtosData.inicializarProdutosComImagensBase64 || (async () => produtosIniciais);

// Log para verificar os dados iniciais
console.log('Dados iniciais de produtos (antes do processamento):', produtosIniciais);

// Função auxiliar para tratamento de erros
const handleApiError = (error, notificar, customMessage = 'Não é você, sou eu ;(') => {
  console.error(customMessage, error);
  notificar({
    variant: "destructive",
    title: "Ops!",
    description: customMessage,
    duration: 5000,
  });
  return error;
};

const ProdutosContexto = createContext();

export const useProdutos = () => useContext(ProdutosContexto);

// Função para formatar preço para número
const formatPriceToNumber = (price) => {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  
  // Remove R$, pontos e troca vírgula por ponto
  const numericValue = price
    .replace(/[^\d,-]/g, '')
    .replace(',', '.');
  
  return parseFloat(numericValue) || 0;
};

// Função para formatar número para preço em reais
const formatNumberToPrice = (value) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Função para processar os produtos
const processarProdutos = (produtos) => {
  console.log('Iniciando processamento de produtos...');
  console.log('Tipo de dados recebido:', typeof produtos);
  console.log('É array?', Array.isArray(produtos));
  console.log('Quantidade de itens:', Array.isArray(produtos) ? produtos.length : 'não é array');
  
  try {
    if (!Array.isArray(produtos)) {
      console.error('Erro: produtos não é um array', produtos);
      return [];
    }
    
    console.log('Primeiros 2 itens para análise:', JSON.stringify(produtos.slice(0, 2), null, 2));
    
    const processados = produtos.map((product, index) => {
      try {
        console.log(`Processando produto ${index}:`, product?.name || 'Sem nome');
        
        if (!product) {
          console.warn(`Produto vazio no índice ${index}`);
          return null;
        }
        
        const processedProduct = {
          ...product,
          id: product.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          price: formatPriceToNumber(product.price),
          discountPrice: product.discountPrice ? formatPriceToNumber(product.discountPrice) : null,
        };
        
        console.log(`Produto ${index} processado:`, processedProduct);
        return processedProduct;
      } catch (error) {
        console.error(`Erro ao processar produto no índice ${index}:`, error, product);
        return null;
      }
    }).filter(Boolean); // Remove itens nulos
    
    console.log('Processamento concluído. Total de produtos processados:', processados.length);
    console.log('Amostra dos produtos processados:', processados.slice(0, 2));
    
    return processados;
  } catch (error) {
    console.error('Erro fatal ao processar produtos:', error);
    return [];
  }
};

export const ProvedorProdutos = ({ children }) => {
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { notificar } = useNotificacao();

  useEffect(() => {
    console.log('Iniciando carregamento de produtos...');
    const loadInitialProducts = async () => {
      try {
        console.log('Verificando localStorage por produtos salvos...');
        const savedProducts = localStorage.getItem('kalineProducts');
        
        // Força o uso dos dados iniciais por enquanto
        console.log('Usando dados iniciais diretamente...');
        console.log('Dados iniciais:', produtosIniciais);
        
        // Processa os produtos iniciais diretamente
        const initialProcessed = processarProdutos([...produtosIniciais]);
        console.log('Produtos processados:', initialProcessed);
        
        // Define os produtos no estado
        setProdutos(initialProcessed);
        
        // Salva no localStorage para uso futuro
        try {
          localStorage.setItem('kalineProducts', JSON.stringify(initialProcessed));
        } catch (error) {
          console.error('Erro ao salvar no localStorage:', error);
        }
      } catch (error) {
        // Se houver algum erro, tenta carregar os produtos iniciais diretamente
        console.error('Erro ao carregar produtos:', error);
        try {
          handleApiError(error, notificar, 'Erro ao carregar produtos. Tentando carregar dados iniciais...');
          
          // Tenta carregar os produtos iniciais sem processar as imagens
          const initialProcessed = processarProdutos(produtosIniciais || []);
          console.log('Produtos iniciais carregados como fallback:', initialProcessed);
          
          setProdutos(initialProcessed);
          
          // Tenta salvar no localStorage, mas não interrompe se falhar
          try {
            localStorage.setItem('kalineProducts', JSON.stringify(initialProcessed));
          } catch (storageError) {
            console.error('Erro ao salvar no localStorage:', storageError);
          }
        } catch (fallbackError) {
          console.error('Erro crítico ao carregar produtos iniciais:', fallbackError);
          setProdutos([]); // Define um array vazio como último recurso
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialProducts();
  }, [notificar]);

  // Função para atualizar o localStorage quando os produtos mudarem
  useEffect(() => {
    try {
      localStorage.setItem('kalineProducts', JSON.stringify(produtos));
    } catch (error) {
      handleApiError(error, notificar, 'Erro ao salvar produtos no localStorage');
    }
  }, [produtos, notificar]);

  // Função para converter imagens em base64
  const ensureImageIsBase64 = async (image) => {
    if (typeof image !== 'string' || image.startsWith('data:image')) {
      return image;
    }

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      handleApiError(error, notificar, 'Erro ao processar imagem');
      return image; // Retorna a URL original em caso de erro
    }
  };

  // Função para adicionar um novo produto
  const addProduct = useCallback(async (newProduct) => {
    try {
      // Processa a imagem se fornecida
      if (newProduct.image) {
        newProduct.image = await ensureImageIsBase64(newProduct.image);
      }
      
      const processedProduct = {
        ...newProduct,
        id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        price: formatPriceToNumber(newProduct.price),
        discountPrice: newProduct.discountPrice ? formatPriceToNumber(newProduct.discountPrice) : null,
      };

      setProdutos(prevProducts => [...prevProducts, processedProduct]);

      notificar({
        title: 'Produto adicionado com sucesso!',
        description: `${newProduct.name} foi adicionado ao catálogo.`,
      });
    } catch (error) {
      handleApiError(error, notificar, 'Erro ao adicionar produto');
    }
  }, [notificar]);

  // Função para atualizar um produto existente
  const updateProduct = useCallback(async (id, updatedFields) => {
    try {
      // Processa a imagem se fornecida
      if (updatedFields.image) {
        updatedFields.image = await ensureImageIsBase64(updatedFields.image);
      }

      // Garante que os preços estejam no formato numérico
      const processedFields = {
        ...updatedFields,
        price: updatedFields.price !== undefined ? formatPriceToNumber(updatedFields.price) : undefined,
        discountPrice: updatedFields.discountPrice !== undefined 
          ? formatPriceToNumber(updatedFields.discountPrice) 
          : updatedFields.discountPrice
      };

      setProdutos(prevProducts => 
        prevProducts.map(product => 
          product.id === id ? { ...product, ...processedFields } : product
        )
      );

      notificar({
        title: 'Produto atualizado com sucesso!',
        description: 'As alterações foram salvas.',
      });
    } catch (error) {
      handleApiError(error, notificar, 'Erro ao atualizar produto');
      throw error;
    }
  }, [notificar]);

  // Função para remover um produto
  const removeProduct = useCallback(async (id) => {
    try {
      setProdutos(prevProducts => prevProducts.filter(product => product.id !== id));

      // Tenta remover do servidor (opcional)
      try {
        const response = await fetch('/api/remove-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'remove', id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Erro ao remover produto:', errorData);
        }
      } catch (error) {
        handleApiError(error, notificar, 'Erro ao remover do servidor');
        // Não interrompe o fluxo se falhar ao remover do servidor
      }
    } catch (error) {
      handleApiError(error, notificar, 'Erro ao remover produto');
      throw error;
    }
  }, [notificar]);

  // Função para buscar um produto por ID
  const getProductById = useCallback((id) => {
    // Tenta encontrar o produto com o ID exato
    let product = produtos.find(product => product.id === id);
    
    // Se não encontrar, tenta encontrar por ID numérico (para compatibilidade com URLs antigas)
    if (!product && !isNaN(id)) {
      product = produtos.find(product => 
        product.id === `prod-${id}` || 
        product.id.endsWith(`-${id}`) ||
        product.id === id.toString()
      );
    }
    
    return product || null;
  }, [produtos]);

  // Função para filtrar produtos por categoria
  const getProductsByCategory = useCallback((categoryId) => {
    return produtos.filter(product => 
      product.category && product.category.toLowerCase() === categoryId.toLowerCase()
    );
  }, [produtos]);

  // Valor do contexto
  const value = useMemo(() => ({
    produtos,
    isLoading,
    addProduct,
    updateProduct,
    removeProduct,
    getProductById,
    getProductsByCategory,
  }), [produtos, isLoading, addProduct, updateProduct, removeProduct, getProductById, getProductsByCategory]);

  return (
    <ProdutosContexto.Provider value={value}>
      {children}
    </ProdutosContexto.Provider>
  );
};

export default ProdutosContexto;
