import React, { createContext, useState, useContext, useEffect } from 'react';
    import initialProductsData, { initializeProductsWithBase64Images } from '@/data/products.js';
    import { useToast } from "@/components/ui/use-toast";

    const ProductContext = createContext();

    export const useProducts = () => useContext(ProductContext);

    export const ProductProvider = ({ children }) => {
      const [products, setProducts] = useState([]);
      const { toast } = useToast();

      useEffect(() => {
        // Força a reinicialização a partir do arquivo base
        localStorage.removeItem('kalineProducts');
        
        // Inicializa com imagens em base64
        initializeProductsWithBase64Images().then(productsWithBase64 => {
          console.log('Produtos inicializados com base64:', productsWithBase64.length);
          setProducts(productsWithBase64);
          localStorage.setItem('kalineProducts', JSON.stringify(productsWithBase64));
        });
      }, []);

      const updateLocalStorage = (updatedProducts) => {
        localStorage.setItem('kalineProducts', JSON.stringify(updatedProducts));
      };

      const addProduct = async (newProduct) => {
        // Garante que a imagem esteja em base64
        let processedProduct = { ...newProduct };
        if (processedProduct.image) {
          processedProduct.image = await ensureImageIsBase64(processedProduct.image);
        }
        
        const productWithDefaults = {
          id: Date.now().toString(), 
          rating: processedProduct.rating || 0, 
          reviews: processedProduct.reviews || 0,
          ...processedProduct
        };
        const updatedProducts = [...products, productWithDefaults];
        setProducts(updatedProducts);
        try {
          const response = await fetch('/api/save-product', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'add', payload: productWithDefaults }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao salvar o produto no servidor');
          }

          // Se a API funcionou, atualiza o estado local e localStorage
          setProducts(updatedProducts);
          updateLocalStorage(updatedProducts);
          toast({ title: "Produto Adicionado!", description: `${processedProduct.name} foi adicionado com sucesso.`, duration: 3000 });
          return { success: true, product: productWithDefaults };
        } catch (error) {
          console.error("Erro ao adicionar produto:", error);
          toast({ title: "Erro ao Adicionar", description: error.message, variant: "destructive", duration: 5000 });
          return { success: false, error: error.message };
        }
      };

      // Função para converter imagem para base64 se necessário
      const ensureImageIsBase64 = async (imageData) => {
        // Se já for base64 ou não existir, retorna como está
        if (!imageData || imageData.startsWith('data:image')) {
          return imageData;
        }
        
        // Se for uma URL, converte para base64
        if (imageData.startsWith('http')) {
          try {
            const response = await fetch(imageData);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          } catch (error) {
            console.error("Erro ao converter imagem para base64:", error);
            return imageData; // Retorna a URL original em caso de erro
          }
        }
        
        return imageData;
      };

      const updateProduct = async (productId, updatedProductData) => {
        const productToUpdate = products.find(p => p.id === productId);
        if (!productToUpdate) {
          toast({ title: "Erro", description: "Produto não encontrado para atualização.", variant: "destructive" });
          return { success: false, error: "Produto não encontrado" };
        }
        
        // Se houver uma nova imagem, garante que esteja em base64
        let processedData = { ...updatedProductData };
        if (updatedProductData.image) {
          processedData.image = await ensureImageIsBase64(updatedProductData.image);
        }

        const finalUpdatedData = { ...productToUpdate, ...processedData };
        try {
          const response = await fetch('/api/save-product', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'update', payload: { ...finalUpdatedData, id: productId } }), // Garante que o ID está no payload
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao atualizar o produto no servidor');
          }
          
          // Se a API funcionou, atualiza o estado local e localStorage
          const newProductsState = products.map(p => 
            p.id === productId ? finalUpdatedData : p
          );
          setProducts(newProductsState);
          updateLocalStorage(newProductsState);
          toast({ title: "Produto Atualizado!", description: `${finalUpdatedData.name} foi atualizado.`, duration: 3000 });
          return { success: true, product: finalUpdatedData };
        } catch (error) {
          console.error("Erro ao atualizar produto:", error);
          toast({ title: "Erro ao Atualizar", description: error.message, variant: "destructive", duration: 5000 });
          return { success: false, error: error.message };
        }
      };

      const deleteProduct = (productId) => {
        const productToDelete = products.find(p => p.id === productId);
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
        updateLocalStorage(updatedProducts);
        if (productToDelete) {
            toast({ title: "Produto Removido!", description: `${productToDelete.name} foi removido.`, variant: "destructive", duration: 3000 });
        }
      };
      
      const getProductById = (productId) => {
        return products.find(p => p.id === productId);
      };

      return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductById, setProducts }}>
          {children}
        </ProductContext.Provider>
      );
    };