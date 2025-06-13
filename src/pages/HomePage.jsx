import React, { useState, useEffect, Suspense, lazy, useMemo, useCallback } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { LayoutGrid, Rows, Columns, Square, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Carregamento preguiçoso do componente ProductCard
const LazyProductCard = lazy(() => import('@/components/ProductCard'));

// Componente wrapper para o ProductCard com fallback de carregamento
const ProductCard = ({ product }) => (
  <Suspense fallback={<div className="h-96 bg-muted rounded-lg animate-pulse"></div>}>
    <LazyProductCard product={product} />
  </Suspense>
);

const HomePage = () => {
  // Estados locais
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [columns, setColumns] = useState('4');
  const [currentGridClass, setCurrentGridClass] = useState('grid-cols-2 sm:grid-cols-2 lg:grid-cols-4');
  const [accessibilityFilter, setAccessibilityFilter] = useState('none');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  
  // Contexto e hooks
  const { products: productsFromContext, isLoading: isLoadingProducts } = useProducts();
  const { toast } = useToast();
  
  // Atualiza a classe da grade quando as colunas mudam
  useEffect(() => {
    switch(columns) {
      case '1':
        setCurrentGridClass('grid-cols-1');
        break;
      case '2':
        setCurrentGridClass('grid-cols-1 sm:grid-cols-2');
        break;
      case '3':
        setCurrentGridClass('grid-cols-1 sm:grid-cols-2 lg:grid-cols-3');
        break;
      case '4':
      default:
        setCurrentGridClass('grid-cols-2 sm:grid-cols-2 lg:grid-cols-4');
    }
  }, [columns]);

  // Estados derivados
  const [allSizes, allColors] = useMemo(() => {
    const sizes = new Set();
    const colors = new Set();
    
    productsFromContext.forEach(product => {
      if (product.sizes) product.sizes.forEach(size => sizes.add(size));
      if (product.colors) product.colors.forEach(color => colors.add(color));
    });
    
    return [
      Array.from(sizes).sort(),
      Array.from(colors).sort()
    ];
  }, [productsFromContext]);
  
  // Efeito para filtrar produtos com base nos filtros selecionados
  useEffect(() => {
    if (isLoadingProducts) return;
    
    const filteredProducts = productsFromContext.filter(product => {
      // Filtro por tamanho
      const sizeMatch = selectedSizes.length === 0 || 
        (product.sizes && selectedSizes.some(size => product.sizes.includes(size)));
      
      // Filtro por cor
      const colorMatch = selectedColors.length === 0 || 
        (product.colors && selectedColors.some(color => product.colors.includes(color)));
      
      return sizeMatch && colorMatch;
    });
    
    setDisplayedProducts(filteredProducts);
  }, [productsFromContext, selectedSizes, selectedColors, isLoadingProducts]);
  
  // Opções de colunas para o seletor de visualização
  const columnOptions = useMemo(() => [
    { value: '1', label: '1 Coluna', icon: <Square className="h-4 w-4" />, mobileLabel: '1' },
    { value: '2', label: '2 Colunas', icon: <Columns className="h-4 w-4" />, mobileLabel: '2' },
    { value: '3', label: '3 Colunas (Médio+)', icon: <Rows className="h-4 w-4" />, mobileLabel: '3' },
    { value: '4', label: '4 Colunas (Largo+)', icon: <LayoutGrid className="h-4 w-4" />, mobileLabel: '4' },
  ], []);
  
  // Filtros de acessibilidade
  const accessibilityFilters = useMemo(() => [
    { value: 'none', label: 'Nenhum' },
    { value: 'protanopia', label: 'Protanopia' },
    { value: 'deuteranopia', label: 'Deuteranopia' },
    { value: 'tritanopia', label: 'Tritanopia' },
    { value: 'achromatopsia', label: 'Acromatopia' },
  ], []);

  useEffect(() => {
    document.documentElement.classList.remove('protanopia-filter', 'deuteranopia-filter', 'tritanopia-filter', 'achromatopsia-filter');
    if (accessibilityFilter !== 'none') {
      document.documentElement.classList.add(`${accessibilityFilter}-filter`);
    }
  }, [accessibilityFilter]);

  const handleSizeChange = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleColorChange = (color) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };


  if (isLoadingProducts) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-full">
              <div className="animate-pulse">
                <div className="aspect-[3/4] w-full bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 sm:space-y-8 ${accessibilityFilter !== 'none' ? `${accessibilityFilter}-filter` : ''}`}>
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative rounded-lg overflow-hidden min-h-[300px] sm:min-h-[400px] flex items-center justify-center text-center p-6 bg-gradient-to-br from-brand-primary-kaline via-brand-secondary-kaline to-brand-primary-kaline/70"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="relative z-10">
          <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-3 sm:mb-4 text-balance">
            Kaline Store
          </h1>
          <p className="text-md sm:text-lg text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto text-balance">
            Moda inclusiva e elegante, pensada para todos.
          </p>
          <Button size="lg" className="bg-white text-brand-primary-kaline hover:bg-white/90 rounded-md px-6 py-2.5 text-base sm:text-lg font-semibold" asChild>
            <Link to="/category/novidades">Ver Coleção</Link>
          </Button>
        </div>
        <img 
            alt="Modelos diversos e sorridentes vestindo roupas coloridas e confortáveis da Kaline Store"
            className="absolute inset-0 w-full h-full object-cover -z-1 opacity-40"
            loading="lazy"
          src="https://images.unsplash.com/photo-1583932387999-dcc7fb40bc40" />
      </motion.section>

      <section aria-labelledby="products-heading">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <h2 id="products-heading" className="text-2xl sm:text-3xl font-heading font-semibold text-brand-text-kaline dark:text-brand-text-kaline">Nossos Produtos</h2>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm" aria-haspopup="true" aria-expanded="false">
                  <Filter className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" /> Filtros
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-brand-card-kaline dark:bg-card">
                {allSizes.length > 0 && (
                    <>
                    <DropdownMenuLabel>Tamanhos</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allSizes.map(size => (
                      <DropdownMenuCheckboxItem
                        key={size}
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={() => handleSizeChange(size)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {size}
                      </DropdownMenuCheckboxItem>
                    ))}
                    </>
                )}
                {allColors.length > 0 && (
                    <>
                    <DropdownMenuLabel className="mt-2">Cores</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allColors.map(color => (
                      <DropdownMenuCheckboxItem
                        key={color}
                        checked={selectedColors.includes(color)}
                        onCheckedChange={() => handleColorChange(color)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {color}
                      </DropdownMenuCheckboxItem>
                    ))}
                    </>
                )}
                {allSizes.length === 0 && allColors.length === 0 && (
                    <DropdownMenuLabel className="text-muted-foreground text-sm p-2">Nenhum filtro disponível.</DropdownMenuLabel>
                )}
              </DropdownMenuContent>
            </DropdownMenu>


          </div>
        </div>
        
        <AnimatePresence>
          {isLoadingProducts ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full py-20 flex justify-center items-center"
            >
              <div className="h-16 w-16 rounded-full border-4 border-brand-primary-kaline border-t-transparent animate-spin">
                <span className="sr-only">Carregando produtos...</span>
              </div>
            </motion.div>
          ) : displayedProducts && displayedProducts.length > 0 ? (
            <motion.div 
              key={currentGridClass + selectedSizes.join(',') + selectedColors.join(',')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className={`grid ${currentGridClass} gap-4 sm:gap-6`}
            >
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="w-full"
                >
                  <Suspense fallback={<div className="h-96 bg-muted rounded-lg animate-pulse"></div>}>
                    <ProductCard product={product} />
                  </Suspense>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-brand-text-muted-kaline dark:text-muted-foreground"
            >
              Nenhum produto encontrado com os filtros selecionados.
            </motion.p>
          )}
        </AnimatePresence>
      </section>


    </div>
  );
};

export default HomePage;