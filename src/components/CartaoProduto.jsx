import React, { useState, useCallback, useMemo } from 'react';
import { Cartao, ConteudoCartao, RodapeCartao, CabecalhoCartao, TituloCartao } from '@/components/ui/cartao-ui';
import { Botao } from '@/components/ui/botao';
import { Heart, ShoppingCart, Star, Eye, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DicaDeFerramenta, DicaDeFerramentaContent, DicaDeFerramentaProvider, DicaDeFerramentaTrigger } from "@/components/ui/dica-ferramenta";
import { Link } from 'react-router-dom';
import { useNotificacao } from "@/components/ui/useNotificacao";
import { Esqueleto } from "@/components/ui/esqueleto";
import { ToastAction } from "@/components/ui/notificacao";

// Esqueleto Loader Component
const CartaoProdutoEsqueleto = React.memo(() => (
  <div className="h-full">
    <Cartao className="overflow-hidden rounded-lg shadow-sm h-full">
      <Esqueleto className="aspect-[3/4] w-full rounded-none" />
      <ConteudoCartao className="p-4 space-y-3">
        <Esqueleto className="h-4 w-3/4" />
        <Esqueleto className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Esqueleto className="h-6 w-20" />
          <Esqueleto className="h-9 w-9 rounded-full" />
        </div>
      </ConteudoCartao>
    </Cartao>
  </div>
));

const CartaoProduto = React.memo(({ product }) => {
  // Verificação de segurança para o objeto product
  if (!product || typeof product !== 'object') {
    console.warn('Produto inválido:', product);
    return null;
  }
  
  // Proteção contra valores indefinidos
  if (!product || typeof product !== 'object' || !product.id) {
    console.warn('Produto inválido ou indefinido:', product);
    return null;
  }
  
  // Desestruturação segura com valores padrão
  const { 
    id,
    name = 'Produto sem nome',
    price = 0,
    image = '',
    rating = 0,
    reviewCount = 0,
    stock = 0,
    discount,
    discountPrice
  } = product;
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      return favs.includes(id);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      return false;
    }
  });
  
  const { notificar } = useNotificacao();

  // Função para alternar favorito
  const toggleFavorite = useCallback((e) => {
    e?.stopPropagation();
    e?.preventDefault();
    
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    
    try {
      let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      if (newFavoriteStatus) {
        favs = [...favs, id];
        notificar({ 
          title: "Adicionado aos favoritos!", 
          description: name, 
          duration: 2000,
          className: "bg-green-500 text-white"
        });
      } else {
        favs = favs.filter(favId => favId !== id);
        notificar({ 
          title: "Removido dos favoritos", 
          description: name, 
          variant: "destructive", 
          duration: 2000 
        });
      }
      
      localStorage.setItem('favorites', JSON.stringify(favs));
    } catch (error) {
      console.error('Erro ao atualizar favoritos:', error);
      notificar({
        variant: "destructive",
        title: "Ops!",
        description: "Não é você, sou eu ;(",
        duration: 3000,
      });
    }
  }, [isFavorite, product.id, product.name, notificar]);

  // Função para adicionar ao carrinho
  const handleAddToCart = useCallback((e) => {
    e?.stopPropagation();
    e?.preventDefault();
    
    try {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ 
          id, 
          name, 
          price, 
          image, 
          rating, 
          reviewCount, 
          stock,
          quantity: 1 
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      notificar({
        title: "Produto adicionado!",
        description: `${name} foi adicionado ao carrinho.`,
        duration: 3000,
        className: "bg-green-500 text-white",
        action: (
          <ToastAction onClick={() => window.location.href = '/carrinho'}>
            Ver Carrinho
          </ToastAction>
        )
      });
      
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      notificar({
        variant: "destructive",
        title: "Ops!",
        description: "Não é você, sou eu ;(",
        duration: 3000,
      });
    }
  }, [product, notificar]);

  // Renderizar estrelas de classificação
  const renderStars = useCallback((rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center" aria-label={`Avaliação: ${rating} de 5 estrelas`}>
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />;
          } else if (i === fullStars && halfStar) {
            return <Star key={i} className="h-4 w-4 fill-yellow-400/50 text-yellow-400/50" aria-hidden="true" />;
          } else {
            return <Star key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" aria-hidden="true" />;
          }
        })}
        {reviewCount && (
          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
            ({reviewCount})
          </span>
        )}
      </div>
    );
  }, [reviewCount]);

  // Formatar preço
  const formatPrice = useCallback((price) => {
    // Se o preço já estiver formatado, retorna ele mesmo
    if (typeof price === 'string' && price.includes('R$')) {
      return price;
    }
    
    // Converte para número se não for
    const numericPrice = typeof price === 'number' ? price : Number(price);
    
    // Verifica se é um número válido
    if (isNaN(numericPrice)) {
      return 'Preço não disponível';
    }
    
    // Formata o preço
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericPrice);
  }, []);
  
  // Formatar preço com desconto
  const formatDiscountPrice = useCallback((price, discount) => {
    if (!discount) return null;
    
    const numericPrice = Number(price);
    const numericDiscount = Number(discount);
    
    if (isNaN(numericPrice) || isNaN(numericDiscount)) {
      return null;
    }
    
    const finalPrice = numericPrice - (numericPrice * (numericDiscount / 100));
    return formatPrice(finalPrice);
  }, [formatPrice]);

  return (
    <DicaDeFerramentaProvider delayDuration={100}>
      <motion.div
        whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.08)" }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="h-full"
      >
        <Cartao className="overflow-hidden rounded-lg shadow-md bg-brand-card-kaline dark:bg-card h-full flex flex-col transform transition-all duration-300 ease-in-out hover:shadow-xl focus-within:ring-2 focus-within:ring-brand-primary-kaline focus-within:ring-offset-2">
          <Link 
            to={`/produtos/${id}`} 
            className="block group focus:outline-none" 
            aria-label={`Ver detalhes de ${name}`}
          >
            <CabecalhoCartao className="p-0 relative">
              <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                {/* Placeholder SVG - Shown while loading or as fallback */}
                <div className={`absolute inset-0 w-full h-full flex items-center justify-center bg-white transition-opacity duration-300 ${
                  isImageLoaded ? 'opacity-0' : 'opacity-100'
                }`}>
                  <svg width="40%" height="40%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="200" fill="#EEEEEE"/>
                    <path d="M84 127L64 107L44 127" stroke="#999999" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M152 64L132 44L112 64" stroke="#999999" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M128 128L100 100L72 128" stroke="#999999" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="100" cy="100" r="50" stroke="#999999" strokeWidth="6"/>
                  </svg>
                </div>
                {/* Actual Product Image */}
                {image && (
                  <img
                    src={image}
                    alt={name || "Imagem do produto"}
                    className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${
                      isImageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                    onLoad={() => setIsImageLoaded(true)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="absolute top-2 right-2 z-10">
                  <DicaDeFerramenta>
                    <DicaDeFerramentaTrigger asChild>
                      <Botao
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:text-red-500 dark:bg-gray-900/80 dark:hover:bg-gray-800"
                        onClick={toggleFavorite}
                        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`} />
                      </Botao>
                    </DicaDeFerramentaTrigger>
                    <DicaDeFerramentaContent>
                      <p>{isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}</p>
                    </DicaDeFerramentaContent>
                  </DicaDeFerramenta>
                </div>
                {stock !== undefined && stock < 10 && (
                  <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    Estoque Baixo!
                  </div>
                )}
              </div>
            </CabecalhoCartao>
            <ConteudoCartao className="p-4 flex-grow">
              <div className="space-y-2">
                <TituloCartao className="text-base font-medium text-gray-900 dark:text-gray-100 line-clamp-2 h-10 flex items-center">
                  {name}
                </TituloCartao>
                {rating !== undefined && (
                  <div className="flex items-center">
                    {renderStars(rating)}
                  </div>
                )}
                <div className="text-right">
                  {discountPrice || discount ? (
                    <>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400 line-through">
                        {formatPrice(price)}
                      </span>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {discount 
                          ? formatDiscountPrice(price, discount)
                          : formatPrice(discountPrice)}
                        {discount && (
                          <span className="ml-2 text-sm font-normal text-green-600 dark:text-green-400">
                            {discount}% OFF
                          </span>
                        )}
                      </p>
                    </>
                  ) : (
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatPrice(price)}
                    </p>
                  )}
                </div>
              </div>
            </ConteudoCartao>
          </Link>
          <RodapeCartao className="p-4 pt-0">
            <div className="w-full flex gap-2">
              <DicaDeFerramenta>
                <DicaDeFerramentaTrigger asChild>
                  <Botao
                    variant="default"
                    size="sm"
                    className="flex-1 bg-brand-primary-kaline hover:bg-brand-primary-kaline/90"
                    onClick={handleAddToCart}
                    aria-label={`Adicionar ${name} ao carrinho`}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Comprar
                  </Botao>
                </DicaDeFerramentaTrigger>
                <DicaDeFerramentaContent>
                  <p>Adicionar ao carrinho</p>
                </DicaDeFerramentaContent>
              </DicaDeFerramenta>
              <DicaDeFerramenta>
                <DicaDeFerramentaTrigger asChild>
                  <Botao 
                    variant="outline" 
                    size="icon" 
                    asChild
                    className="border-brand-primary-kaline/50 text-brand-primary-kaline hover:bg-brand-primary-kaline/10"
                  >
                    <Link to={`/produtos/${id}`} aria-label={`Ver detalhes de ${name}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Botao>
                </DicaDeFerramentaTrigger>
                <DicaDeFerramentaContent>
                  <p>Ver detalhes</p>
                </DicaDeFerramentaContent>
              </DicaDeFerramenta>
            </div>
          </RodapeCartao>
        </Cartao>
      </motion.div>
    </DicaDeFerramentaProvider>
  );
});

export { CartaoProdutoEsqueleto };
export default CartaoProduto;