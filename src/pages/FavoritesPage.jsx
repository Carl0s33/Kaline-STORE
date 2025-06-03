
    import React from 'react';
    import ProductCard from '@/components/ProductCard';
    import productsData from '@/data/products.js'; // Using all products for now, filter by actual favorites later
    import { motion } from 'framer-motion';
    import { Heart } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';

    // Mock favorites - in a real app, this would come from localStorage or context
    const favoriteIds = ['1', '5']; 
    const favoriteProducts = productsData.filter(p => favoriteIds.includes(p.id));

    const FavoritesPage = () => {
      // const [favorites, setFavorites] = React.useState(favoriteProducts); // If managing state locally

      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h1 className="text-4xl font-heading font-semibold text-brand-text dark:text-brand-text mb-8 text-center">
            Meus Favoritos <Heart className="inline-block ml-2 h-8 w-8 text-rose-500 fill-rose-500" />
          </h1>

          {favoriteProducts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {favoriteProducts.map((product) => (
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
            <div className="text-center py-12 bg-brand-beige dark:bg-card rounded-lg shadow-md">
              <Heart className="h-24 w-24 text-brand-text-muted dark:text-muted-foreground mx-auto mb-6" />
              <p className="text-xl text-brand-text-muted dark:text-muted-foreground mb-4">Você ainda não tem produtos favoritos.</p>
              <p className="text-sm text-brand-text-muted dark:text-muted-foreground mb-6">Clique no ícone de coração nos produtos para adicioná-los!</p>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
                <Link to="/">Ver Produtos</Link>
              </Button>
            </div>
          )}
        </motion.div>
      );
    };

    export default FavoritesPage;
  