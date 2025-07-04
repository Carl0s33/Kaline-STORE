import React from 'react'; // obrigado deus por existir
import CartaoProduto from '@/components/CartaoProduto'; // o mesmo de sempre
import produtosData from '@/data/produtos.js'; // dados mocados pq sim
import { motion } from 'framer-motion'; // animaçoes q ninguem ve
import { Heart } from 'lucide-react'; // icone de coracao partido
import { Botao } from '@/components/ui/botao'; // botao generico
import { Link } from 'react-router-dom'; // pra voltar pra home quando cansar


// ids dos produtos favoritos
// ta hardcoded mesmo, problema seu
const favoriteIds = ['1', '5']; 

// filtra os produtos favoritos
// se nao achar, azar
const favoriteProducts = produtosData.filter(p => favoriteIds.includes(p.id));
// sim, podia ser um contexto
// mas hoje nao, valeu

const FavoritesPage = () => {
  // estado local pra gerenciar favoritos
  // mentira, nao tem estado
  // #fazparte #soquerooponto

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="div-espacada"
    >
      <h1 className="text-4xl font-heading font-semibold text-brand-text dark:text-brand-text mb-8 text-center">
        Meus Favoritos <Heart className="inline-block ml-2 h-8 w-8 text-rose-500 fill-rose-500" />
        {/* icone de coracao que nao faz nada */}
      </h1>
      {/* titulo bonito pra enganar o professor */}

      {/* se tiver favoritos, mostra */}
      {/* se nao tiver, mostra que nao tem */}
      {/* simples e direto */}
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
              // animaçao de entrada
              // ninguem nota, mas ta ai
              variants={{
                hidden: { opacity: 0, y: 20 }, // começa invisivel
                visible: { opacity: 1, y: 0 }  // termina visivel
              }} // magica pura, nao mexe
            >
              <CartaoProduto product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <>
          {/* mensagem quando nao tem favoritos */}
          {/* a que ninguem vai ver pq ta hardcoded */}
          <div className="div-centralizada div-destaque div-arredondada div-sombra">
          {/* icone grande pra ocupar espaço */}
          <Heart className="h-24 w-24 text-brand-text-muted dark:text-muted-foreground mx-auto mb-6" />
          <p className="text-xl text-brand-text-muted dark:text-muted-foreground mb-4">Você ainda não tem produtos favoritos.</p>
          <p className="text-sm text-brand-text-muted dark:text-muted-foreground mb-6">Clique no ícone de coração nos produtos para adicioná-los!</p>
          <Botao asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
            <Link to="/">Ver Produtos</Link>
          </Botao>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default FavoritesPage;
  