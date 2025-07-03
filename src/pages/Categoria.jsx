import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import produtos from "@/data/produtos";
import { motion, AnimatePresence } from 'framer-motion';

const CartaoProduto = lazy(() => import('@/components/CartaoProduto'));

// página que mostra os produtos de uma categoria
// se não achar a categoria, já era
const CategoryPage = () => {
  // pega o nome da categoria da URL
  // se não tiver, já era
  const { categoryName } = useParams();
  // lista de produtos filtrados
  // começa vazia e só deus sabe quando vai encher
  const [filteredPprodutos, setFilteredPprodutos] = useState([]);
  // estado de loading
  // enquanto é true, mostra um spinner bonitinho
  const [isLoading, setIsLoading] = useState(true);

  // quando a categoria mudar, busca os produtos
  // se der erro, já era
  useEffect(() => {
    setIsLoading(true);
    const decodedCategoryName = decodeURIComponent(categoryName);
    const filtered = produtos.filter(p => p.category.toLowerCase() === decodedCategoryName.toLowerCase());
    
    // simula um loadingzinho pra ficar bonito
    // senão fica muito rápido e o usuário não acredita que funcionou
    setTimeout(() => {
      setFilteredPprodutos(filtered);
      setIsLoading(false);
    }, 300);
  }, [categoryName]);

  // formata o título da categoria
  // se não tiver nome, coloca 'Categoria' e foda-se
  const categoryTitle = categoryName ? decodeURIComponent(categoryName) : 'Categoria';

  return (
    <div className="div-container min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="titulo-principal">
          Categoria: <span className="text-brand-primary-kaline">{categoryTitle}</span>
        </h1>
        <p className="text-md text-brand-text-muted-kaline dark:text-muted-foreground mb-8">
          {filteredPprodutos.length} {filteredPprodutos.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>
      </motion.div>

      {/* animação de entrada/saída */}
      {/* se não tiver, fica feio pra caramba */}
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
        ) : filteredPprodutos.length > 0 ? (
          <motion.div
            key="product-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {filteredPprodutos.map((produto, index) => (
              <motion.div
                key={produto.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="w-full"
              >
                <Suspense fallback={<div className="h-96 bg-muted rounded-lg animate-pulse"></div>}>
                  <CartaoProduto product={produto} />
                </Suspense>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            key="no-produtos"
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
  