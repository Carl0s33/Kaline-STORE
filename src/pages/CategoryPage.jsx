import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import products from '@/data/products';
import { motion, AnimatePresence } from 'framer-motion';

const ProductCard = lazy(() => import('@/components/ProductCard'));

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const decodedCategoryName = decodeURIComponent(categoryName);
    const filtered = products.filter(p => p.category.toLowerCase() === decodedCategoryName.toLowerCase());
    
    // Simulate a short loading time for better UX
    setTimeout(() => {
      setFilteredProducts(filtered);
      setIsLoading(false);
    }, 300);
  }, [categoryName]);

  const categoryTitle = categoryName ? decodeURIComponent(categoryName) : 'Categoria';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-text-kaline dark:text-brand-text-muted-kaline mb-2">
          Categoria: <span className="text-brand-primary-kaline">{categoryTitle}</span>
        </h1>
        <p className="text-md text-brand-text-muted-kaline dark:text-muted-foreground mb-8">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full py-20 flex justify-center items-center"
          >
            <div className="h-16 w-16 rounded-full border-4 border-brand-primary-kaline border-t-transparent animate-spin">
              <span className="sr-only">Carregando produtos...</span>
            </div>
          </motion.div>
        ) : filteredProducts.length > 0 ? (
          <motion.div
            key="product-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="w-full"
              >
                <Suspense fallback={<div className="h-96 bg-muted rounded-lg animate-pulse"></div>}>
                  <ProductCard product={product} />
                </Suspense>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            key="no-products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 text-brand-text-muted-kaline dark:text-muted-foreground"
          >
            Nenhum produto encontrado nesta categoria.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryPage;
  