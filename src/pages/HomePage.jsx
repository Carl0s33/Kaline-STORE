import React, { useState, useEffect, Suspense, lazy } from 'react';
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

    const ProductCard = lazy(() => import('@/components/ProductCard'));

    const HomePage = () => {
      const { products: productsFromContext } = useProducts();
      const [displayedProducts, setDisplayedProducts] = useState([]);
      const [columns, setColumns] = useState('2'); 
      const { toast } = useToast();
      const [accessibilityFilter, setAccessibilityFilter] = useState('none');
      const [isLoading, setIsLoading] = useState(true);

          const [allSizes, setAllSizes] = useState([]);
      const [allColors, setAllColors] = useState([]);

      const [selectedSizes, setSelectedSizes] = useState([]);
      const [selectedColors, setSelectedColors] = useState([]);
  
      // Efeito para carregar os produtos e aplicar filtros
      useEffect(() => {
        setIsLoading(true);
        
        // Pequeno atraso para garantir que os produtos sejam carregados corretamente
        const timer = setTimeout(() => {
          if (productsFromContext && productsFromContext.length > 0) {
            setAllSizes([...new Set(productsFromContext.flatMap(p => p.sizes || []))]);          
            setAllColors([...new Set(productsFromContext.flatMap(p => p.colors || []))]);          
          }

          let filtered = productsFromContext || [];

          if (selectedSizes.length > 0) {
            filtered = filtered.filter(p => p.sizes && p.sizes.some(s => selectedSizes.includes(s)));
          }
          if (selectedColors.length > 0) {
            filtered = filtered.filter(p => p.colors && p.colors.some(c => selectedColors.includes(c)));
          }
          
          setDisplayedProducts(filtered);
          setIsLoading(false);
        }, 300);
        
        return () => clearTimeout(timer);
      }, [productsFromContext, selectedSizes, selectedColors]);
  
      // Efeito para mostrar o toast de boas-vindas
      useEffect(() => {
        if (productsFromContext && productsFromContext.length > 0) {
          toast({
            title: "Bem-vinda à Kaline Store!",
            description: "Explore nossa coleção acessível e estilosa.",
            duration: 3000,
          });
        }
      }, [toast, productsFromContext]);
      
      const getResponsiveGridClass = () => {
        let classString = 'grid-cols-1 sm:grid-cols-2'; 
        if (columns === '1') classString = 'grid-cols-1';
        if (columns === '3') classString += ' md:grid-cols-3';
        if (columns === '4') classString += ' md:grid-cols-3 lg:grid-cols-4';
        return classString;
      };
      
      const [currentGridClass, setCurrentGridClass] = useState(getResponsiveGridClass());

      useEffect(() => {
        setCurrentGridClass(getResponsiveGridClass());
      }, [columns]);

      const columnOptions = [
        { value: '1', label: '1 Coluna', icon: <Square className="h-4 w-4" />, mobileLabel: '1' },
        { value: '2', label: '2 Colunas', icon: <Columns className="h-4 w-4" />, mobileLabel: '2' },
        { value: '3', label: '3 Colunas (Médio+)', icon: <Rows className="h-4 w-4" />, mobileLabel: '3' },
        { value: '4', label: '4 Colunas (Largo+)', icon: <LayoutGrid className="h-4 w-4" />, mobileLabel: '4' },
      ];

      const accessibilityFilters = [
        { value: 'none', label: 'Nenhum' },
        { value: 'protanopia', label: 'Protanopia' },
        { value: 'deuteranopia', label: 'Deuteranopia' },
        { value: 'tritanopia', label: 'Tritanopia' },
        { value: 'achromatopsia', label: 'Acromatopia' },
      ];

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

                {/* Seletor de grid unificado para todos os dispositivos */}
                <RadioGroup
                  value={columns}
                  onValueChange={setColumns}
                  className="flex items-center gap-1 p-0.5 bg-muted dark:bg-popover rounded-md"
                  aria-label="Selecionar número de colunas da grade de produtos"
                >
                  {columnOptions.map(opt => (
                    <div key={`grid-option-${opt.value}`} className="relative">
                      <RadioGroupItem value={opt.value} id={`col-${opt.value}`} className="sr-only" />
                      <Label 
                        htmlFor={`col-${opt.value}`}
                        className={`min-w-8 h-8 flex items-center justify-center rounded-sm cursor-pointer transition-colors ${columns === opt.value ? 'bg-brand-primary-kaline text-primary-foreground' : 'hover:bg-accent text-brand-text-kaline dark:text-brand-text-muted-kaline'}`}
                        title={opt.label}
                      >
                        <span className="hidden sm:inline">{opt.icon}</span>
                        <span className="sm:hidden">{opt.mobileLabel}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            
            <AnimatePresence>
              {isLoading ? (
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

          <section className="mt-8 p-4 bg-brand-card-kaline dark:bg-card rounded-lg shadow" aria-labelledby="accessibility-settings-heading">
            <h3 id="accessibility-settings-heading" className="text-xl font-semibold mb-3 text-brand-text-kaline">Acessibilidade Visual</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Label htmlFor="accessibility-filter-select" className="text-sm text-brand-text-muted-kaline">Filtro de Cor:</Label>
              <select 
                id="accessibility-filter-select"
                value={accessibilityFilter}
                onChange={(e) => setAccessibilityFilter(e.target.value)}
                className="p-2 border border-input rounded-md bg-background dark:bg-input text-sm focus:ring-brand-primary-kaline"
                aria-describedby="accessibility-filter-description"
              >
                {accessibilityFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
            </div>
             <p id="accessibility-filter-description" className="text-xs text-brand-text-muted-kaline mt-2">
              Selecione um filtro para simular diferentes tipos de daltonismo. Esta é uma ferramenta de simulação.
            </p>
          </section>
        </div>
      );
    };

    export default HomePage;