import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import initialProductsData from '@/data/products.js';
import { useToast } from "@/components/ui/use-toast";

// Função auxiliar para tratamento de erros
const handleApiError = (error, toast, customMessage = 'Não é você, sou eu ;(') => {
  console.error(customMessage, error);
  toast({
    variant: "destructive",
    title: "Ops!",
    description: customMessage,
    duration: 5000,
  });
  return error;
};

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

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
const processProducts = (products) => {
  return products.map((product) => ({
    ...product,
    id: product.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    price: formatPriceToNumber(product.price),
    discountPrice: product.discountPrice ? formatPriceToNumber(product.discountPrice) : null,
  }));
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const savedProducts = localStorage.getItem('kalineProducts');
      return savedProducts ? JSON.parse(savedProducts) : [];
    } catch (error) {
      handleApiError(error, toast, 'Erro ao carregar produtos do localStorage');
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Carrega os produtos iniciais apenas uma vez
  useEffect(() => {
    const loadInitialProducts = async () => {
      if (products.length === 0) {
        try {
          const processedProducts = processProducts(initialProductsData);
          setProducts(processedProducts);
          localStorage.setItem('kalineProducts', JSON.stringify(processedProducts));
        } catch (error) {
          handleApiError(error, toast, 'Não foi possível carregar os produtos iniciais');
        } finally {
          setIsLoading(false);
        }
      } else {
        // Garante que os produtos existentes tenham os preços formatados corretamente
        const processedProducts = processProducts(products);
        setProducts(processedProducts);
        setIsLoading(false);
      }
    };

    loadInitialProducts();
  }, [toast]);

  // Função para atualizar o localStorage quando os produtos mudarem
  useEffect(() => {
    if (products.length > 0) {
      try {
        localStorage.setItem('kalineProducts', JSON.stringify(products));
      } catch (error) {
        handleApiError(error, toast, 'Erro ao salvar produtos no localStorage');
      }
    }
  }, [products, toast]);

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
      handleApiError(error, toast, 'Erro ao processar imagem');
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

      // Garante que os preços estejam no formato numérico
      const processedProduct = {
        ...newProduct,
        id: `prod-${Date.now()}`,
        price: formatPriceToNumber(newProduct.price),
        discountPrice: newProduct.discountPrice ? formatPriceToNumber(newProduct.discountPrice) : null,
      };

      setProducts(prevProducts => {
        const updatedProducts = [...prevProducts, processedProduct];
        localStorage.setItem('kalineProducts', JSON.stringify(updatedProducts));
        return updatedProducts;
      });

      toast({
        title: 'Produto adicionado com sucesso!',
        description: `${newProduct.name} foi adicionado ao catálogo.`,
      });
    } catch (error) {
      handleApiError(error, toast, 'Erro ao adicionar produto');
    }
  }, [toast]);

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

      setProducts(prevProducts => {
        const updatedProducts = prevProducts.map(product => 
          product.id === id ? { ...product, ...processedFields } : product
        );
        localStorage.setItem('kalineProducts', JSON.stringify(updatedProducts));
        return updatedProducts;
      });

      toast({
        title: 'Produto atualizado com sucesso!',
        description: 'As alterações foram salvas.',
      });
    } catch (error) {
      handleApiError(error, toast, 'Erro ao atualizar produto');
      throw error;
    }
  }, [toast]);

  // Função para remover um produto
  const removeProduct = useCallback(async (id) => {
    try {
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));

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
        handleApiError(error, toast, 'Erro ao remover do servidor');
        // Não interrompe o fluxo se falhar ao remover do servidor
      }
    } catch (error) {
      handleApiError(error, toast, 'Erro ao remover produto');
      throw error;
    }
  }, [toast]);

  // Função para buscar um produto por ID
  const getProductById = useCallback((id) => {
    // Tenta encontrar o produto com o ID exato
    let product = products.find(product => product.id === id);
    
    // Se não encontrar, tenta encontrar por ID numérico (para compatibilidade com URLs antigas)
    if (!product && !isNaN(id)) {
      product = products.find(product => 
        product.id === `prod-${id}` || 
        product.id.endsWith(`-${id}`) ||
        product.id === id.toString()
      );
    }
    
    return product || null;
  }, [products]);

  // Função para filtrar produtos por categoria
  const getProductsByCategory = useCallback((categoryId) => {
    return products.filter(product => 
      product.category && product.category.toLowerCase() === categoryId.toLowerCase()
    );
  }, [products]);

  // Valor do contexto
  const value = useMemo(() => ({
    products,
    isLoading,
    addProduct,
    updateProduct,
    removeProduct,
    getProductById,
    getProductsByCategory,
  }), [products, isLoading, addProduct, updateProduct, removeProduct, getProductById, getProductsByCategory]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
