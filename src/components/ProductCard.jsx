import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

    const ProductCard = ({ product }) => {
      const [isFavorite, setIsFavorite] = React.useState(() => {
        const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
        return favs.includes(product.id);
      });
      const { toast } = useToast();

      const toggleFavorite = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const newFavoriteStatus = !isFavorite;
        setIsFavorite(newFavoriteStatus);
        let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (newFavoriteStatus) {
          favs.push(product.id);
          toast({ title: "Adicionado aos favoritos!", description: product.name, duration: 2000 });
        } else {
          favs = favs.filter(favId => favId !== product.id);
          toast({ title: "Removido dos favoritos.", description: product.name, variant: "destructive", duration: 2000 });
        }
        localStorage.setItem('favorites', JSON.stringify(favs));
      };

      const handleAddToCart = (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        toast({
          title: "Produto adicionado ao carrinho!",
          description: `${product.name} foi adicionado.`,
          action: <ToastAction altText="Ver carrinho" onClick={() => window.location.href='/cart'}>Ver Carrinho</ToastAction>,
          duration: 3000
        });
        
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      };
      
      const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
          stars.push(<Star key={`full-${i}-${product.id}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />);
        }
        
        if (halfStar) {
           stars.push(<Star key={`half-${product.id}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} aria-hidden="true"/>);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
          stars.push(<Star key={`empty-${i}-${product.id}`} className="h-4 w-4 text-gray-300 dark:text-gray-600" aria-hidden="true"/>);
        }
        return stars;
      };

      return (
        <TooltipProvider delayDuration={100}>
  <motion.div
    whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.08)" }}
    transition={{ duration: 0.2, ease: "circOut" }}
    className="h-full"
  >
    <Card className="overflow-hidden rounded-lg shadow-md bg-brand-card-kaline dark:bg-card h-full flex flex-col transform transition-all duration-300 ease-in-out hover:shadow-xl focus-within:ring-2 focus-within:ring-brand-primary-kaline focus-within:ring-offset-2">
      <Link to={`/product/${product.id}`} className="block group focus:outline-none" aria-label={`Ver detalhes de ${product.name}`}>
        <CardHeader className="p-0 relative">
          <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img 
  alt={product.name || "Imagem do produto"}
  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 group-focus:scale-105"
  loading="lazy"
  src={
    product.image && (product.image.startsWith('data:image') || product.image.startsWith('http'))
      ? product.image
      : "https://images.unsplash.com/photo-1671376354106-d8d21e55dddd"
  }
/>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black rounded-full text-rose-500 hover:text-rose-600 focus-visible:ring-1 focus-visible:ring-rose-500"
                        onClick={toggleFavorite}
                        aria-label={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                      >
                        <Heart className={`h-5 w-5 transition-all ${isFavorite ? 'fill-rose-500' : 'fill-transparent'}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-popover-foreground">
                      <p>{isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}</p>
                    </TooltipContent>
                  </Tooltip>
                  {product.stock && product.stock < 10 && (
                    <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      Estoque Baixo!
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-3 sm:p-4 flex-grow">
                  <CardTitle className="text-base sm:text-lg font-semibold text-brand-text-kaline dark:text-brand-text-kaline mb-1 truncate" title={product.name}>
                    {product.name}
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-brand-text-muted-kaline dark:text-muted-foreground mb-1 sm:mb-2">{product.category}</p>
                  <div className="flex items-center mb-1 sm:mb-2" aria-label={`Avaliação: ${product.rating} de 5 estrelas`}>
                    {renderStars(product.rating)}
                    <span className="ml-1.5 text-xs text-brand-text-muted-kaline">({product.reviews})</span>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-brand-primary-kaline mb-0">{product.price}</p>
                </CardContent>
              </Link>
              <CardFooter className="p-3 sm:p-4 pt-0 mt-auto">
                <div className="flex gap-2 w-full">
                  <Button 
                    className="flex-1 btn-primary-kaline rounded-md font-medium text-xs sm:text-sm transition-transform duration-200 hover:scale-105"
                    onClick={handleAddToCart}
                    aria-label={`Adicionar ${product.name} ao carrinho`}
                  >
                    <ShoppingCart className="mr-1.5 h-4 w-4" /> Comprar
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                       <Link to={`/product/${product.id}`} aria-label={`Visualização rápida de ${product.name}`}>
                        <Button variant="outline" size="icon" className="border-brand-primary-kaline/50 text-brand-primary-kaline hover:bg-brand-primary-kaline/10 rounded-md transition-transform duration-200 hover:scale-105">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-popover-foreground">
                      <p>Ver Detalhes</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </TooltipProvider>
      );
    };
    
    export default ProductCard;