import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Botao } from '@/components/ui/botao';
import { Cartao, ConteudoCartao, CabecalhoCartao, TituloCartao, RodapeCartao } from '@/components/ui/cartao-ui';
import { Entrada } from '@/components/ui/entrada';
import { useProdutos } from '@/contexts/ContextoProduto';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Edit2, Trash2, Search, Package, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/dialogo-alerta";

const ManageProductsPage = () => {
  const { produtos, deleteProduct } = useProdutos();
  const [searchTerm, setSearchTerm] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);

  const filteredProducts = produtos.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };
  
  const defaultImage = "https://images.unsplash.com/photo-1600577916048-85e976972793?w=100&h=100&fit=crop";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="div-container div-espacada"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-text-kaline">
          Gerenciar Produtos
        </h1>
        <Botao asChild className="btn-primary-kaline text-sm">
          <Link to="/seller/produtos/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Produto
          </Link>
        </Botao>
      </div>

      <Card className="bg-brand-card-kaline dark:bg-card shadow-xl mb-6">
        <CabecalhoCartao>
          <TituloCartao className="text-lg text-brand-text-kaline flex items-center">
            <Search className="mr-2 h-5 w-5"/>
            Buscar Produtos
          </TituloCartao>
        </CabecalhoCartao>
        <ConteudoCartao>
          <Entrada 
            type="text"
            placeholder="Buscar por nome ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background dark:bg-input"
          />
        </ConteudoCartao>
      </Card>

      {filteredProducts.length === 0 ? (
        <Cartao className="bg-brand-card-kaline dark:bg-card shadow-lg">
          <ConteudoCartao className="p-6 text-center">
             <Package className="mx-auto h-16 w-16 text-brand-text-muted-kaline mb-4" />
            <p className="text-lg text-brand-text-muted-kaline">
              {searchTerm ? "Nenhum produto encontrado com sua busca." : "Você ainda não adicionou nenhum produto."}
            </p>
            {!searchTerm && (
              <Botao asChild className="mt-4 btn-primary-kaline text-sm">
                <Link to="/seller/produtos/new">Adicionar seu primeiro produto</Link>
              </Botao>
            )}
          </ConteudoCartao>
        </Cartao>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Cartao className="bg-brand-card-kaline dark:bg-card shadow-md hover:shadow-lg transition-shadow">
                  <ConteudoCartao className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img 
                        src={product.image && product.image.startsWith('http') ? product.image : defaultImage} 
                        alt={product.name} 
                        className="w-16 h-16 object-cover rounded-md bg-muted" 
                        onError={(e) => { e.target.onerror = null; e.target.src=defaultImage; }}
                      />
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-brand-text-kaline truncate" title={product.name}>{product.name}</h3>
                        <p className="text-xs sm:text-sm text-brand-text-muted-kaline">{product.category} - {product.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Botao variant="outline" size="sm" asChild className="text-xs border-yellow-500 text-yellow-600 hover:bg-yellow-500/10 hover:text-yellow-700">
                        <Link to={`/seller/produtos/edit/${product.id}`}>
                          <Edit2 className="mr-1 h-3.5 w-3.5" /> Editar
                        </Link>
                      </Botao>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Botao variant="destructive" size="sm" onClick={() => setProductToDelete(product)} className="text-xs">
                            <Trash2 className="mr-1 h-3.5 w-3.5" /> Remover
                          </Botao>
                        </AlertDialogTrigger>
                        {productToDelete && productToDelete.id === product.id && (
                          <AlertDialogContent className="bg-brand-card-kaline dark:bg-card">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-brand-text-kaline flex items-center">
                                <AlertTriangle className="h-5 w-5 mr-2 text-destructive"/>
                                Confirmar Remoção
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-brand-text-muted-kaline">
                                Tem certeza que deseja remover o produto "{productToDelete.name}"? Esta ação não poderá ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setProductToDelete(null)} className="hover:bg-muted">Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        )}
                      </AlertDialog>
                    </div>
                  </ConteudoCartao>
                </Cartao>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default ManageProductsPage;