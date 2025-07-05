// imports obrigatorios que ngm entende direito pra que serve
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom'; // pra pegar parametro da url
import produtos from "@/data/produtos"; // dados mocados pq sim
import { motion, AnimatePresence } from 'framer-motion'; // animaçoes inuteis

// carregamento preguiçoso pq sim
// se der pau, problema seu
const CartaoProduto = lazy(() => import('@/components/CartaoProduto'));


// se nao achar, azar o seu
const CategoryPage = () => {
  // pega o nome da categoria da URL
  // se nao tiver, ferrou
  const { categoryName } = useParams();
  // lista de produtos filtrados
  // comeca vazia e so deus sabe quando vai encher

  const [filteredPprodutos, setFilteredPprodutos] = useState([]);
  // estado de loading
  // enquanto é true, mostra um spinner bonitinho
  // que ninguem liga mesmo
  
  const [isLoading, setIsLoading] = useState(true);

  // quando a categoria mudar, busca os produtos
  // se der erro, ja era
a
  useEffect(() => {
    setIsLoading(true);
    const decodedCategoryName = decodeURIComponent(categoryName);
    const filtered = produtos.filter(p => p.category.toLowerCase() === decodedCategoryName.toLowerCase());
    
    // simula um loadingzinho pra ficar bonito
    // senao fica rapido demais e o usuario acha que é mentira
   
    setTimeout(() => {
      setFilteredPprodutos(filtered);
      setIsLoading(false);
    }, 300);
  }, [categoryName]);

  // formata o titulo da categoria
  // se nao tiver nome, coloca 'Categoria' e foda-se

  const categoryTitle = categoryName ? decodeURIComponent(categoryName) : 'Categoria';

  return (
    // container principal
    // o min-h-screen é so pra nao ficar feio
    <div className="div-container min-h-screen">
      {/* animaçao de entrada do titulo */}
      {/* so pra parecer que tem algo acontecendo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} // comeca invisivel
        animate={{ opacity: 1, y: 0 }} // termina visivel
        transition={{ duration: 0.5 }} // duracao da animaçao
      >
        {/* titulo da categoria */}
        {/* se nao tiver nome, mostra 'Categoria' e foda-se */}
        <h1 className="titulo-principal">
          Categoria: <span className="text-brand-primary-kaline">{categoryTitle}</span>
        </h1>
        {/* contador de produtos */}
        {/* que as vezes some do nada */}
        <p className="text-md text-brand-text-muted-kaline dark:text-muted-foreground mb-8">
          {filteredPprodutos.length} {filteredPprodutos.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>
      </motion.div>

      {/* animação de entrada/saída */}
      {/* se não tiver, fica feio pra caramba */}
      {/* #animacaoInutil #masFicaBonito */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }} // comeca invisivel
            animate={{ opacity: 1 }} // aparece
            exit={{ opacity: 0 }} // some
            className="w-full py-20 flex justify-center items-center"
          >
            {/* spinner que gira infinitamente */}
            {/* ate a pagina travar */}
            <div className="h-16 w-16 rounded-full border-4 border-brand-primary-kaline border-t-transparent animate-spin">
              <span className="sr-only">Carregando produtos...</span>
            </div>
          </motion.div>
        ) : filteredPprodutos.length > 0 ? (
          <motion.div
            key="product-grid"
            initial={{ opacity: 0 }} // comeca invisivel
            animate={{ opacity: 1 }} // aparece
            transition={{ duration: 0.4 }} // duracao da animaçao
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {filteredPprodutos.map((produto, index) => (
              <motion.div
                key={produto.id} // chave unica obrigatoria
                initial={{ opacity: 0, y: 15 }} // comeca deslocado
                animate={{ opacity: 1, y: 0 }} // termina no lugar
                transition={{ duration: 0.3, delay: index * 0.04 }} // delayzinho bonito
                className="w-full" // ocupa toda a largura
              >
                <Suspense fallback={
                  <div className="h-96 bg-muted rounded-lg animate-pulse">
                    {/* loading bonitinho */}
                    {/* que some rapido demais */}
                  </div>
                }>
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
  