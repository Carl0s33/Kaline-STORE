import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star, Eye, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton Loader Component
const ProductCardSkeleton = React.memo(() => (
  <div className="h-full">
    <Card className="overflow-hidden rounded-lg shadow-sm h-full">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </CardContent>
    </Card>
  </div>
));

const ProductCard = React.memo(({ product }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      return favs.includes(product.id);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      return false;
    }
  });
  
  const { toast } = useToast();

  // Função para alternar favorito
  const toggleFavorite = useCallback((e) => {
    e?.stopPropagation();
    e?.preventDefault();
    
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    
    try {
      let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      if (newFavoriteStatus) {
        favs = [...favs, product.id];
        toast({ 
          title: "Adicionado aos favoritos!", 
          description: product.name, 
          duration: 2000,
          className: "bg-green-500 text-white"
        });
      } else {
        favs = favs.filter(favId => favId !== product.id);
        toast({ 
          title: "Removido dos favoritos", 
          description: product.name, 
          variant: "destructive", 
          duration: 2000 
        });
      }
      
      localStorage.setItem('favorites', JSON.stringify(favs));
    } catch (error) {
      console.error('Erro ao atualizar favoritos:', error);
      toast({
        variant: "destructive",
        title: "Ops!",
        description: "Não é você, sou eu ;(",
        duration: 3000,
      });
    }
  }, [isFavorite, product.id, product.name, toast]);

  // Função para adicionar ao carrinho
  const handleAddToCart = useCallback((e) => {
    e?.stopPropagation();
    e?.preventDefault();
    
    try {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      toast({
        title: "Produto adicionado!",
        description: `${product.name} foi adicionado ao carrinho.`,
        action: (
          <ToastAction 
            altText="Ver carrinho" 
            onClick={() => window.location.href = '/cart'}
            className="hover:bg-white/10"
          >
            Ver Carrinho
          </ToastAction>
        ),
        duration: 3000,
        className: "bg-green-500 text-white"
      });
      
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast({
        variant: "destructive",
        title: "Ops!",
        description: "Não é você, sou eu ;(",
        duration: 3000,
      });
    }
  }, [product, toast]);

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
        {product.reviewCount && (
          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
            ({product.reviewCount})
          </span>
        )}
      </div>
    );
  }, [product.reviewCount]);

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
    <TooltipProvider delayDuration={100}>
      <motion.div
        whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.08)" }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="h-full"
      >
        <Card className="overflow-hidden rounded-lg shadow-md bg-brand-card-kaline dark:bg-card h-full flex flex-col transform transition-all duration-300 ease-in-out hover:shadow-xl focus-within:ring-2 focus-within:ring-brand-primary-kaline focus-within:ring-offset-2">
          <Link 
            to={`/product/${product.id}`} 
            className="block group focus:outline-none" 
            aria-label={`Ver detalhes de ${product.name}`}
          >
            <CardHeader className="p-0 relative">
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
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name || "Imagem do produto"}
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:text-red-500 dark:bg-gray-900/80 dark:hover:bg-gray-800"
                        onClick={toggleFavorite}
                        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                {product.stock !== undefined && product.stock < 10 && (
                  <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    Estoque Baixo!
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <div className="space-y-2">
                <CardTitle className="text-base font-medium text-gray-900 dark:text-gray-100 line-clamp-2 h-10 flex items-center">
                  {product.name}
                </CardTitle>
                {product.rating !== undefined && (
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                )}
                <div className="text-right">
                  {product.discountPrice || product.discount ? (
                    <>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {product.discount 
                          ? formatDiscountPrice(product.price, product.discount)
                          : formatPrice(product.discountPrice)}
                        {product.discount && (
                          <span className="ml-2 text-sm font-normal text-green-600 dark:text-green-400">
                            {product.discount}% OFF
                          </span>
                        )}
                      </p>
                    </>
                  ) : (
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatPrice(product.price)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Link>
          <CardFooter className="p-4 pt-0">
            <div className="w-full flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 bg-brand-primary-kaline hover:bg-brand-primary-kaline/90"
                    onClick={handleAddToCart}
                    aria-label={`Adicionar ${product.name} ao carrinho`}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Comprar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Adicionar ao carrinho</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    asChild
                    className="border-brand-primary-kaline/50 text-brand-primary-kaline hover:bg-brand-primary-kaline/10"
                  >
                    <Link to={`/product/${product.id}`} aria-label={`Ver detalhes de ${product.name}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver detalhes</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
});

export { ProductCardSkeleton };
export default ProductCard;