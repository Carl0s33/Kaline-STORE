import React from 'react';
import CartaoProduto from '@/components/CartaoProduto';
import produtosData from '@/data/produtos.js';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Botao } from '@/components/ui/botao';
import { Link } from 'react-router-dom';


const favoriteIds = ['1', '5']; 
const favoriteProducts = produtosData.filter(p => favoriteIds.includes(p.id));

const FavoritesPage = () => {
  // Estado local para gerenciar favoritos

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="div-espacada"
    >
      <h1 className="text-4xl font-heading font-semibold text-brand-text dark:text-brand-text mb-8 text-center">
        Meus Favoritos <Heart className="inline-block ml-2 h-8 w-8 text-rose-500 fill-rose-500" />
      </h1>

      {favoriteProducts.length > 0 ? (
        <motion.div 
          className="div-espacada"
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
              <CartaoProduto product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="div-centralizada div-destaque div-arredondada div-sombra">
          <Heart className="h-24 w-24 text-brand-text-muted dark:text-muted-foreground mx-auto mb-6" />
          <p className="text-xl text-brand-text-muted dark:text-muted-foreground mb-4">Você ainda não tem produtos favoritos.</p>
          <p className="text-sm text-brand-text-muted dark:text-muted-foreground mb-6">Clique no ícone de coração nos produtos para adicioná-los!</p>
          <Botao asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
            <Link to="/">Ver Produtos</Link>
          </Botao>
        </div>
      )}
    </motion.div>
  );
};

export default FavoritesPage;
  