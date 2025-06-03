
    import React, { useState, useEffect } from 'react';
    import { useParams } from 'react-router-dom';
    import ProductCard from '@/components/ProductCard';
    import productsData from '@/data/products.js';
    import { motion } from 'framer-motion';

    const CategoryPage = () => {
      const { categoryName } = useParams();
      const [filteredProducts, setFilteredProducts] = useState([]);
      const [currentCategory, setCurrentCategory] = useState('');

      useEffect(() => {
        const categoryMap = {
          novidades: "Novidades",
          vestidos: "Vestidos",
          acessorios: "Acessórios",
          promocoes: "Promoções"
        };
        const displayCategoryName = categoryMap[categoryName.toLowerCase()] || categoryName;
        setCurrentCategory(displayCategoryName);

        const products = productsData.filter(
          (product) => product.category.toLowerCase() === displayCategoryName.toLowerCase()
        );
        setFilteredProducts(products);
      }, [categoryName]);

      return (
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-heading font-semibold text-brand-text dark:text-brand-text mb-8 text-center">
              {currentCategory}
            </h1>
          </motion.div>

          {filteredProducts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.p 
              className="text-center text-brand-text-muted dark:text-muted-foreground text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Nenhum produto encontrado nesta categoria no momento.
            </motion.p>
          )}
        </div>
      );
    };

    export default CategoryPage;
  