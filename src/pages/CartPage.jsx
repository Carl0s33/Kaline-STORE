import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Link } from 'react-router-dom';
    import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
    import { useToast } from "@/components/ui/use-toast";

    const CartPage = () => {
      const [cartItems, setCartItems] = useState([]);
      const { toast } = useToast();

      useEffect(() => {
        const loadCart = () => {
          const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
          setCartItems(storedCart);
        };
        loadCart();
        window.addEventListener('cartUpdated', loadCart);
        return () => window.removeEventListener('cartUpdated', loadCart);
      }, []);

      const updateCartInStorage = (updatedCart) => {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      };

      const handleRemoveItem = (itemId, itemSize, itemColor) => {
        const updatedCart = cartItems.filter(item => 
          !(item.id === itemId && item.size === itemSize && item.color === itemColor)
        );
        updateCartInStorage(updatedCart);
        toast({
          title: "Item removido!",
          description: "O produto foi removido do seu carrinho.",
          variant: "destructive",
          duration: 2000,
        });
      };

      const handleQuantityChange = (itemId, itemSize, itemColor, newQuantity) => {
        if (newQuantity < 1) {
          handleRemoveItem(itemId, itemSize, itemColor); // Remove if quantity is zero
          return;
        }
        const updatedCart = cartItems.map(item => 
          (item.id === itemId && item.size === itemSize && item.color === itemColor) 
            ? { ...item, quantity: newQuantity } 
            : item
        );
        updateCartInStorage(updatedCart);
      };

      const subtotal = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
        return sum + (price * item.quantity);
      }, 0);

      const defaultImage = "https://images.unsplash.com/photo-1600577916048-85e976972793?w=100&h=100&fit=crop";


      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8"
        >
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-text-kaline">
              Meu Carrinho
            </h1>
            <ShoppingCart className="ml-2 h-7 w-7 sm:h-8 sm:w-8 text-brand-primary-kaline" />
          </div>

          {cartItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 sm:py-12 bg-brand-card-kaline dark:bg-card rounded-lg shadow-lg"
            >
              <ShoppingCart className="h-16 w-16 sm:h-20 sm:w-20 text-brand-text-muted-kaline dark:text-muted-foreground mx-auto mb-4 sm:mb-6" />
              <p className="text-lg sm:text-xl text-brand-text-muted-kaline dark:text-muted-foreground mb-3 sm:mb-4">Seu carrinho está vazio.</p>
              <Button asChild className="btn-primary-kaline rounded-md text-sm">
                <Link to="/">Continuar Comprando</Link>
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-brand-card-kaline dark:bg-card p-4 sm:p-6 rounded-lg shadow-lg">
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${item.size}-${item.color}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex flex-col sm:flex-row items-center justify-between py-3 sm:py-4 border-b border-border/60 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0 flex-grow w-full sm:w-auto">
                         <img 
                            src={item.image && item.image.startsWith('http') ? item.image : defaultImage} 
                            alt={item.name} 
                            className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-md bg-muted"
                            onError={(e) => { e.target.onerror = null; e.target.src=defaultImage; }}
                          />
                        <div className="min-w-0">
                          <Link to={`/product/${item.id}`} className="font-semibold text-sm sm:text-base text-brand-text-kaline dark:text-brand-text-kaline hover:underline truncate block" title={item.name}>
                            {item.name}
                          </Link>
                          <p className="text-xs sm:text-sm text-brand-text-muted-kaline dark:text-muted-foreground">
                            {item.size && `Tam: ${item.size}`} {item.color && item.size && ` - `}{item.color && `Cor: ${item.color}`}
                          </p>
                          <p className="text-xs sm:text-sm text-brand-text-muted-kaline dark:text-muted-foreground sm:hidden mt-1">{item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center border border-input rounded-md">
                          <Button variant="ghost" size="sm" onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity - 1)} className="px-2 h-8 w-8 rounded-r-none text-brand-primary-kaline hover:bg-brand-primary-kaline/10">
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="px-2 sm:px-3 text-xs sm:text-sm w-8 text-center">{item.quantity}</span>
                          <Button variant="ghost" size="sm" onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity + 1)} className="px-2 h-8 w-8 rounded-l-none text-brand-primary-kaline hover:bg-brand-primary-kaline/10">
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <p className="font-semibold text-sm sm:text-base text-brand-text-kaline dark:text-brand-text-kaline w-20 sm:w-24 text-right">
                          R$ {(parseFloat(item.price.replace('R$ ', '').replace(',', '.')) * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id, item.size, item.color)} className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-full h-8 w-8">
                          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="bg-brand-card-kaline dark:bg-card p-4 sm:p-6 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-lg sm:text-xl font-semibold text-brand-text-kaline dark:text-brand-text-kaline">Subtotal: R$ {subtotal.toFixed(2).replace('.', ',')}</p>
                  <p className="text-xs sm:text-sm text-brand-text-muted-kaline dark:text-muted-foreground">Taxas e frete serão calculados no checkout.</p>
                </div>
                <Button size="lg" className="btn-primary-kaline rounded-md text-sm sm:text-base w-full sm:w-auto" asChild>
                  <Link to="/checkout">Finalizar Compra</Link>
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      );
    };

    export default CartPage;