import React, { useState, useEffect } from 'react';
    import { useParams, Link } from 'react-router-dom';
    import { useProducts } from '@/contexts/ProductContext';
    import { Button } from '@/components/ui/button';
    import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
    import { Label } from '@/components/ui/label';
    import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Star, CheckCircle } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useToast } from "@/components/ui/use-toast";
    import ProductCard from '@/components/ProductCard'; 
    import LoadingSpinner from '@/components/LoadingSpinner';

    const ProductDetailPage = () => {
      const { productId } = useParams();
      const { getProductById, products: allProducts } = useProducts();
      const { toast } = useToast();
      
      const [product, setProduct] = useState(null);
      const [selectedSize, setSelectedSize] = useState('');
      const [selectedColor, setSelectedColor] = useState('');
      const [quantity, setQuantity] = useState(1);
      const [currentImageIndex, setCurrentImageIndex] = useState(0);
      const [isFavorite, setIsFavorite] = React.useState(false);
      const [isLoading, setIsLoading] = useState(true);

      const mockImages = (baseImage) => {
          if (!baseImage || baseImage.startsWith('http')) { // Check if it's a URL
              return [
                  baseImage || "https://images.unsplash.com/photo-1600577916048-85e976972793?w=300", 
                  "https://images.unsplash.com/photo-1551803091-e3e467919757?w=300",
                  "https://images.unsplash.com/photo-1568252540092-79c6ba39a239?w=300",
              ];
          }
          // If it's not a URL, assume it's a placeholder description that needs a real image
          return [
              "https://images.unsplash.com/photo-1600577916048-85e976972793?w=300",
              "https://images.unsplash.com/photo-1551803091-e3e467919757?w=300",
              "https://images.unsplash.com/photo-1568252540092-79c6ba39a239?w=300",
          ];
      };
      const [productImages, setProductImages] = useState([]);

      useEffect(() => {
        setIsLoading(true);
        const foundProduct = getProductById(productId);
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedSize(foundProduct.sizes && foundProduct.sizes.length > 0 ? foundProduct.sizes[0] : '');
          setSelectedColor(foundProduct.colors && foundProduct.colors.length > 0 ? foundProduct.colors[0] : '');
          setProductImages(mockImages(foundProduct.image));
          const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
          setIsFavorite(favs.includes(foundProduct.id));
        }
        setIsLoading(false);
      }, [productId, getProductById]);

      const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productImages.length);
      };

      const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + productImages.length) % productImages.length);
      };

      const handleAddToCart = () => {
        if (!selectedSize && product.sizes && product.sizes.length > 0) {
          toast({ title: "Selecione um tamanho", variant: "destructive", duration: 2000 });
          return;
        }
        if (!selectedColor && product.colors && product.colors.length > 0) {
          toast({ title: "Selecione uma cor", variant: "destructive", duration: 2000 });
          return;
        }
        
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItemIndex = cart.findIndex(item => item.id === product.id && item.size === selectedSize && item.color === selectedColor);

        if (existingItemIndex > -1) {
          cart[existingItemIndex].quantity += quantity;
        } else {
          cart.push({ ...product, quantity, size: selectedSize, color: selectedColor, image: product.image });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        
        toast({
          title: "Produto adicionado!",
          description: `${product.name} (${selectedSize}, ${selectedColor}) foi adicionado ao carrinho.`,
          action: <Button variant="link" size="sm" asChild><Link to="/cart">Ver Carrinho</Link></Button>,
          duration: 3000,
          className: "bg-green-500 text-white dark:bg-green-600",
          icon: <CheckCircle className="h-5 w-5 text-white" />
        });
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      };

      const toggleFavorite = () => {
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

      const relatedProducts = allProducts.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4);
      
      if (isLoading) {
        return <LoadingSpinner />;
      }

      if (!product) {
        return <div className="text-center py-10">Produto não encontrado. <Link to="/" className="text-brand-primary-kaline hover:underline">Voltar para início</Link></div>;
      }

      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8"
        >
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="relative">
              <AnimatePresence initial={false} custom={currentImageIndex}>
                <motion.img
                  key={currentImageIndex}
                  src={productImages[currentImageIndex]}
                  alt={`${product.name || 'Produto'} - imagem ${currentImageIndex + 1}`}
                  initial={{ opacity: 0, x: currentImageIndex > 0 ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: currentImageIndex > 0 ? -50 : 50 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full aspect-[3/4] object-cover rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800"
                  loading="lazy"
                />
              </AnimatePresence>
              {productImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {productImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentImageIndex ? 'bg-brand-primary-kaline scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                        aria-label={`Ir para imagem ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-text-kaline dark:text-brand-text-kaline">{product.name}</h1>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} aria-hidden="true"/>
                  ))}
                </div>
                <span className="text-sm text-brand-text-muted-kaline">({product.reviews} avaliações)</span>
              </div>
              <p className="text-2xl sm:text-3xl font-semibold text-brand-primary-kaline">{product.price}</p>
              
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <Label htmlFor="size-group" className="text-sm font-medium text-brand-text-kaline dark:text-brand-text-kaline mb-1.5 block">Tamanho:</Label>
                  <RadioGroup id="size-group" value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2" aria-label="Seleção de tamanho">
                    {product.sizes.map(size => (
                      <div key={size}>
                        <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                        <Label 
                          htmlFor={`size-${size}`}
                          className={`px-3 py-1.5 border rounded-md text-xs sm:text-sm cursor-pointer transition-all ${selectedSize === size ? 'bg-brand-primary-kaline text-primary-foreground border-brand-primary-kaline ring-2 ring-brand-primary-kaline ring-offset-1' : 'bg-background hover:bg-muted border-input'}`}
                        >
                          {size}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div>
                  <Label htmlFor="color-group" className="text-sm font-medium text-brand-text-kaline dark:text-brand-text-kaline mb-1.5 block">Cor: <span className="font-normal">{selectedColor}</span></Label>
                  <RadioGroup id="color-group" value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2" aria-label="Seleção de cor">
                    {product.colors.map(color => (
                      <div key={color}>
                        <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                        <Label 
                          htmlFor={`color-${color}`}
                          title={color}
                          className={`w-7 h-7 sm:w-8 sm:h-8 border-2 rounded-full cursor-pointer transition-all flex items-center justify-center ${selectedColor === color ? 'ring-2 ring-brand-primary-kaline ring-offset-2 border-transparent' : 'border-input hover:border-brand-primary-kaline/50'}`}
                          style={{ backgroundColor: color.toLowerCase().replace(/\s+/g, '').replace('ó', 'o').replace('ê', 'e') }} 
                          aria-label={`Selecionar cor ${color}`}
                        >
                          {selectedColor === color && <CheckCircle className="h-4 w-4 text-white mix-blend-difference" />}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
              
              <div className="flex items-center space-x-3 pt-2">
                <Button 
                  onClick={handleAddToCart} 
                  size="lg" 
                  className="flex-1 btn-primary-kaline rounded-md text-sm sm:text-base"
                  aria-label="Adicionar ao carrinho"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar ao Carrinho
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={toggleFavorite} 
                  className={`rounded-md border-brand-primary-kaline/50 hover:bg-brand-primary-kaline/10 ${isFavorite ? 'text-rose-500' : 'text-brand-primary-kaline'}`}
                  aria-label={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
                </Button>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-semibold text-brand-text-kaline dark:text-brand-text-kaline mb-2">Descrição</h3>
                <p className="text-sm text-brand-text-muted-kaline dark:text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              <div className="pt-2">
                 <Button variant="link" className="p-0 h-auto text-brand-primary-kaline hover:underline text-sm">Ver tabela de medidas</Button>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-12 sm:mt-16">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-brand-text-kaline dark:text-brand-text-kaline mb-4 sm:mb-6">Você também pode gostar</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map(relatedProduct => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      );
    };

    export default ProductDetailPage;