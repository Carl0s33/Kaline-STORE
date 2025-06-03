import React, { createContext, useState, useContext, useEffect } from 'react';
    import initialProductsData from '@/data/products.js';
    import { useToast } from "@/components/ui/use-toast";

    const ProductContext = createContext();

    export const useProducts = () => useContext(ProductContext);

    export const ProductProvider = ({ children }) => {
      const [products, setProducts] = useState([]);
      const { toast } = useToast();

      useEffect(() => {
        const storedProducts = localStorage.getItem('kalineProducts');
        if (storedProducts) {
          try {
            setProducts(JSON.parse(storedProducts));
          } catch (error) {
            console.error("Error parsing products from localStorage:", error);
            setProducts(initialProductsData);
            localStorage.setItem('kalineProducts', JSON.stringify(initialProductsData));
          }
        } else {
          setProducts(initialProductsData);
          localStorage.setItem('kalineProducts', JSON.stringify(initialProductsData));
        }
      }, []);

      const updateLocalStorage = (updatedProducts) => {
        localStorage.setItem('kalineProducts', JSON.stringify(updatedProducts));
      };

      const addProduct = (newProduct) => {
        const productWithDefaults = {
          id: Date.now().toString(), 
          rating: newProduct.rating || 0, 
          reviews: newProduct.reviews || 0,
          ...newProduct
        };
        const updatedProducts = [...products, productWithDefaults];
        setProducts(updatedProducts);
        updateLocalStorage(updatedProducts);
        toast({ title: "Produto Adicionado!", description: `${newProduct.name} foi adicionado com sucesso.`, duration: 3000 });
      };

      const updateProduct = (productId, updatedProductData) => {
        const updatedProducts = products.map(p => 
          p.id === productId ? { ...p, ...updatedProductData } : p
        );
        setProducts(updatedProducts);
        updateLocalStorage(updatedProducts);
        toast({ title: "Produto Atualizado!", description: `${updatedProductData.name} foi atualizado.`, duration: 3000 });
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