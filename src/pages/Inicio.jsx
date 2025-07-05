import React, { useState, useEffect, Suspense, lazy, useMemo, useCallback } from 'react';
import { useProdutos } from '@/contexts/ContextoProduto';
import { Botao } from "@/components/ui/botao";
import { Label } from '@/components/ui/rotulo';
import { GrupoRadio, ItemGrupoRadio } from '@/components/ui/grupo-radio';
import { LayoutGrid, Rows, Columns, Square, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificacao } from "@/components/ui/useNotificacao";
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  CaixaSelecaoMenuSuspenso,
  RotuloMenuSuspenso,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu-suspenso";

// carregamento preguiçoso pq o react é um mimado que nao aguenta um json com mais de 10 itens

const LazyCartaoProduto = lazy(() => import('@/components/CartaoProduto'));

// Componente wrapper para o CartaoProduto com fallback de carregamento
const CartaoProduto = ({ product }) => (
  <Suspense fallback={<div className="h-96 bg-muted rounded-lg animate-pulse"></div>}>
    <LazyCartaoProduto product={product} />
  </Suspense>
);


// aviso: contém código feito na madrugada do prazo
// se funcionar, foi sorte
// se não funcionar, tenta dar F5
const HomePage = () => {


  // Estados locais
  const [displayedProdutos, setDisplayedProdutos] = useState([]);
  const [columns, setColumns] = useState('4');
  const [currentGridClass, setCurrentGridClass] = useState('grid-cols-2 sm:grid-cols-2 lg:grid-cols-4');
  const [accessibilityFilter, setAccessibilityFilter] = useState('none');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  
  // Contexto e hooks
  const { produtos: produtosFromContext, isLoading: isLoadingProdutos } = useProdutos();
  const { notificar } = useNotificacao();
  
  // Logs de depuração detalhados
  console.log('=== INÍCIO DA RENDERIZAÇÃO ===');
  console.log('isLoadingProdutos:', isLoadingProdutos);
  console.log('Tipo de produtosFromContext:', typeof produtosFromContext);
  console.log('É array?', Array.isArray(produtosFromContext));
  console.log('Quantidade de produtos:', Array.isArray(produtosFromContext) ? produtosFromContext.length : 'não é array');
  console.log('Primeiros 2 produtos:', Array.isArray(produtosFromContext) ? produtosFromContext.slice(0, 2) : 'não é array');
  
  // Efeito para monitorar mudanças nos produtos
  useEffect(() => {
    console.log('=== MUDANÇA NOS PRODUTOS ===');
    console.log('isLoadingProdutos:', isLoadingProdutos);
    console.log('Total de produtos:', Array.isArray(produtosFromContext) ? produtosFromContext.length : 0);
  }, [produtosFromContext, isLoadingProdutos]);
  
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

  // pega todos os tamanhos e cores dos produtos
  // pq sim, o trabalho pede filtro
  const [allSizes, allColors] = useMemo(() => {
    const sizes = new Set();
    const colors = new Set();
    
    // loop que ninguem entende mas funciona
    // se reclamar eu choro
    produtosFromContext.forEach(produto => {
      if (produto.sizes) produto.sizes.forEach(size => sizes.add(size));
      if (produto.colors) produto.colors.forEach(color => colors.add(color));
    });
    
    // retorna tudo bonitinho pro filtro que ninguem vai usar
    return [
      Array.from(sizes).sort(),
      Array.from(colors).sort()
    ];
  }, [produtosFromContext]); // atualiza quando os produtos carregam (ou não)
  
  // filtro que nunca funciona direito na primeira vez
  // mas depois de 3 tentativas vai
  useEffect(() => {
    console.log('=== TENTANDO FILTRAR ESSA BAGUNÇA ===');
    console.log('ta carregando? claro que ta:', isLoadingProdutos);
    console.log('produtos do contexto (ou nao):', produtosFromContext);
    console.log('tamanhos selecionados (se tiver):', selectedSizes);
    console.log('cores selecionadas (se der sorte):', selectedColors);
    
    // se ainda ta carregando, nem tenta
    // vai dar erro mesmo
    if (isLoadingProdutos) {
      console.log('ta carregando ainda, volta depois');
      return;
    }
    
    // se nao for array, deu merda
    // mas quem liga, o importante é tentar
    if (!Array.isArray(produtosFromContext)) {
      console.error('nao é array nao, o que vc fez?', produtosFromContext);
      setDisplayedProdutos([]); // lista vazia pra nao quebrar tudo
      return;
    }
    
    console.log('tentando filtrar essa bagunça...');
    const filteredProdutos = produtosFromContext.filter(produto => {
      // se o produto for uma bosta, ignora
      if (!produto || typeof produto !== 'object') {
        console.warn('tem um lixo aqui ó:', produto);
        return false;
      }
      
      // filtro por tamanho
      // se nao tiver tamanho selecionado, passa tudo
      // pq sim, preguiça de tratar isso direito
      const sizeMatch = selectedSizes.length === 0 || 
        (produto.sizes && selectedSizes.some(size => produto.sizes.includes(size)));
      
      // filtro por cor
      // mesma lógica preguiçosa de cima
      const colorMatch = selectedColors.length === 0 || 
        (produto.colors && selectedColors.some(color => produto.colors.includes(color)));
      
      // se passar nos dois filtros (ou se ninguem tiver selecionado nada)
      const matches = sizeMatch && colorMatch;
      console.log(`produto ${produto.id} - ${produto.name || 'sem nome'}:`, { 
        sizeMatch, 
        colorMatch, 
        matches,
        // adicionando mais logs inuteis pra parecer que fiz algo util
        'hora': new Date().toISOString(),
        'sorte': Math.random() > 0.5 ? 'deu bom' : 'vai dar ruim'
      });
      
      return matches; // se der match, coloca na lista
    });
    
    console.log('filtrei e so sobrou isso:', filteredProdutos);
    setDisplayedProdutos(filteredProdutos); // joga na tela e reza pra funcionar
    console.log('atualizei a lista com', filteredProdutos.length, 'coisas');
    console.log('agora vai... ou não');
  }, [produtosFromContext, selectedSizes, selectedColors, isLoadingProdutos]);
  
  // opções de colunas que ninguem vai mudar
  // mas o trabalho pedia entao toma
  const columnOptions = useMemo(() => [
    { value: '1', label: '1 Coluna (tela de celular quebrado)', icon: <Square className="h-4 w-4" />, mobileLabel: '1' },
    { value: '2', label: '2 Colunas (padrao do pobre)', icon: <Columns className="h-4 w-4" />, mobileLabel: '2' },
    { value: '3', label: '3 Colunas (ta se achando)', icon: <Rows className="h-4 w-4" />, mobileLabel: '3' },
    { value: '4', label: '4 Colunas (tela grande é? mostre pra todo mundo)', icon: <LayoutGrid className="h-4 w-4" />, mobileLabel: '4' },
  ], []); // array vazio pq sim, nao precisa recalcular
  
  // filtros de acessibilidade que ninguem vai usar
  // mas o trabalho pedia acessibilidade entao toma
  const accessibilityFilters = useMemo(() => [
    { value: 'none', label: 'Nenhum (modo padrão)' },
    { value: 'protanopia', label: 'Protanopia (vermelho é verde?)' },
    { value: 'deuteranopia', label: 'Deuteranopia (verde é vermelho?)' },
    { value: 'tritanopia', label: 'Tritanopia (azul é rosa?)' },
    { value: 'achromatopsia', label: 'Acromatopia (tudo preto e branco)' },
  ], []); // de novo array vazio pq nao sou obrigado

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


  // CARREGANDO? DE NOVO?
  // MAS QUE MERDA DE LOADING É ESSE QUE NUNCA ACABA?
  // O PROF VAI PENSAR QUE TRAVOU E VAI ME TIRAR PONTO
  // #odeioajax #quandovahtrbalhodepoo
  if (isLoadingProdutos) {
    return (
      <div className="div-espacada">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="div-espacada">
              <div className="div-espacada">
                <div className="div-arredondada div-espacada"></div>
                <div className="div-arredondada div-espacada"></div>
                <div className="div-arredondada div-espacada"></div>
                <div className="div-espacada">
                  <div className="flex justify-between items-center">
                    <div className="div-arredondada div-espacada"></div>
                    <div className="div-arredondada div-espacada"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Dados das promoções para o carrossel
  const promocoes = [
    {
      id: 1,
      titulo: 'Ofertas Imperdíveis',
      descricao: 'Até 50% de desconto em itens selecionados',
      imagem: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      textoBotao: 'Aproveitar Ofertas',
      link: '/ofertas'
    },
    {
      id: 2,
      titulo: 'Novos Lançamentos',
      descricao: 'As últimas tendências chegaram na loja',
      imagem: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      textoBotao: 'Ver Novidades',
      link: '/novidades'
    },
    {
      id: 3,
      titulo: 'Frete Grátis',
      descricao: 'Em compras acima de R$ 200,00',
      imagem: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      textoBotao: 'Comprar Agora',
      link: '/produtos'
    }
  ];

  // Estado para controlar o slide atual
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Efeito para resetar o estado de carregamento quando o slide mudar
  useEffect(() => {
    setIsImageLoaded(false);
  }, [currentPromoIndex]);
  
  // Função para lidar com o carregamento da imagem
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };
  
  // Efeito para pré-carregar a próxima imagem
  useEffect(() => {
    const nextIndex = (currentPromoIndex + 1) % promocoes.length;
    const img = new Image();
    img.src = promocoes[nextIndex].imagem;
  }, [currentPromoIndex, promocoes]);

  // Avança para o próximo slide
  const nextSlide = useCallback(() => {
    setCurrentPromoIndex((prevIndex) => 
      prevIndex === promocoes.length - 1 ? 0 : prevIndex + 1
    );
  }, [promocoes.length]);

  // Volta para o slide anterior
  const prevSlide = useCallback(() => {
    setCurrentPromoIndex((prevIndex) =>
      prevIndex === 0 ? promocoes.length - 1 : prevIndex - 1
    );
  }, [promocoes.length]);

  // Estado para controlar se o usuário está interagindo com o carrossel
  const [isPaused, setIsPaused] = useState(false);

  // Configura o intervalo para trocar os slides automaticamente
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);
  
  // Pausa a troca automática quando o mouse está sobre o carrossel
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div className={`div-espacada ${accessibilityFilter !== 'none' ? `${accessibilityFilter}-filter` : ''}`}>
      {/* Carrossel de Promoções */}
      <div 
        className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg mb-8 shadow-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {/* Botões de navegação */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-brand-primary-kaline p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-kaline focus:ring-offset-2"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-brand-primary-kaline p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-kaline focus:ring-offset-2"
          aria-label="Próximo slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPromoIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 w-full h-full"
          >
            <div 
              className="w-full h-full bg-cover bg-center relative overflow-hidden"
              style={{ 
                backgroundImage: `url(${promocoes[currentPromoIndex].imagem})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Overlay de loading */}
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-brand-primary-kaline border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* Imagem real com transição suave */}
              <img
                src={promocoes[currentPromoIndex].imagem}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={handleImageLoad}
                loading="lazy"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center p-6 text-center transition-opacity duration-500 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="text-white max-w-2xl">
                  <motion.h2 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-5xl font-bold mb-2 md:mb-4"
                  >
                    {promocoes[currentPromoIndex].titulo}
                  </motion.h2>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-xl mb-6 md:mb-8"
                  >
                    {promocoes[currentPromoIndex].descricao}
                  </motion.p>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link 
                      to={promocoes[currentPromoIndex].link}
                      className="inline-block bg-brand-primary-kaline hover:bg-brand-primary-kaline/90 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      {promocoes[currentPromoIndex].textoBotao}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Indicadores de slide */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
          {promocoes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPromoIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentPromoIndex 
                  ? 'w-8 bg-brand-primary-kaline' 
                  : 'w-3 bg-white/70 hover:bg-white'
              }`}
              aria-label={`Ir para o slide ${index + 1}`}
              aria-current={index === currentPromoIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>



    
      <section aria-labelledby="produtos-heading" className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <h2 id="produtos-heading" className="text-2xl sm:text-3xl font-heading font-semibold text-brand-text-kaline dark:text-brand-text-kaline">
            Nossos Produtos
            <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full align-middle">
    
            </span>
          </h2>
          
          {/* Filtros - porque todo mundo adora clicar em 50 botões diferentes, certo? */}
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border rounded-md hover:bg-gray-50 transition-colors"
                  aria-label="Filtrar produtos"
                >
                  <Filter className="w-4 h-4" />
                  Filtrar
                  <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                    5+
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-3" align="end">
                <div className="space-y-4">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1.5">Ordenar por</Label>
                    <select className="w-full text-sm border rounded p-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                      <option>Mais relevantes</option>
                      <option>Menor preço</option>
                      <option>Maior preço</option>
                      <option>Mais vendidos</option>
                      <option>Lançamentos</option>
                      <option>Maior desconto</option>
                      <option>Melhor avaliados</option>
                    </select>
                  </div>
                  
                  <DropdownMenuSeparator className="my-2" />
                  
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">Cores</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { nome: 'Vermelho', cor: '#ef4444' },
                        { nome: 'Azul', cor: '#3b82f6' },
                        { nome: 'Verde', cor: '#10b981' },
                        { nome: 'Preto', cor: '#000000' },
                        { nome: 'Branco', cor: '#ffffff', border: true },
                        { nome: 'Amarelo', cor: '#f59e0b' },
                        { nome: 'Roxo', cor: '#8b5cf6' },
                        { nome: 'Rosa', cor: '#ec4899' },
                      ].map(({ nome, cor, border }) => (
                        <button
                          key={nome}
                          className={`w-7 h-7 rounded-full ${border ? 'border-2 border-gray-300' : ''}`}
                          style={{ backgroundColor: cor }}
                          title={nome}
                          aria-label={`Filtrar por cor ${nome}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Mais filtros que ninguém vai usar, mas deixamos aqui pra parecer que temos muitas opções */}
                  <div className="pt-2 border-t">
                    <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium text-center">
                      Limpar filtros
                    </button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Botao variant="outline" size="sm" className="text-xs sm:text-sm" aria-haspopup="true" aria-expanded="false">
                  <Filter className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" /> Filtros
                </Botao>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-brand-card-kaline dark:bg-card">
                {allSizes.length > 0 && (
                    <>
                    <RotuloMenuSuspenso>Tamanhos</RotuloMenuSuspenso>
                    <DropdownMenuSeparator />
                    {allSizes.map(size => (
                      <CaixaSelecaoMenuSuspenso
                        key={size}
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={() => handleSizeChange(size)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {size}
                      </CaixaSelecaoMenuSuspenso>
                    ))}
                    </>
                )}
                {allColors.length > 0 && (
                    <>
                    <RotuloMenuSuspenso className="mt-2">Cores</RotuloMenuSuspenso>
                    <DropdownMenuSeparator />
                    {allColors.map(color => (
                      <CaixaSelecaoMenuSuspenso
                        key={color}
                        checked={selectedColors.includes(color)}
                        onCheckedChange={() => handleColorChange(color)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {color}
                      </CaixaSelecaoMenuSuspenso>
                    ))}
                    </>
                )}
                {allSizes.length === 0 && allColors.length === 0 && (
                    <RotuloMenuSuspenso className="text-muted-foreground text-sm p-2">Nenhum filtro disponível.</RotuloMenuSuspenso>
                )}
              </DropdownMenuContent>
            </DropdownMenu>


          </div>
        </div>
        
        <AnimatePresence>
          {isLoadingProdutos ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full py-20 flex justify-center items-center"
            >
              <div className="h-16 w-16 rounded-full border-4 border-brand-primary-kaline border-t-transparent animate-spin">
                <span className="sr-only">Carregando produtos...</span>
              </div>
            </motion.div>
          ) : displayedProdutos && displayedProdutos.length > 0 ? (
            <motion.div 
              key={currentGridClass + selectedSizes.join(',') + selectedColors.join(',')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className={`grid ${currentGridClass} gap-4 sm:gap-6`}
            >
              {displayedProdutos.map((produto, index) => {
                if (!produto || !produto.id) {
                  console.warn('Produto inválido no displayedProdutos:', produto);
                  return null;
                }
                
                return (
                  <motion.div
                    key={produto.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="w-full"
                  >
                    <Suspense fallback={<div className="h-96 bg-muted rounded-lg animate-pulse"></div>}>
                      <CartaoProduto product={produto} />
                    </Suspense>
                  </motion.div>
                );
              })}
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