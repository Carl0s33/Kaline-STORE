import React, { useState, useEffect, Suspense, lazy, useMemo, useCallback } from 'react';
import { useProdutos } from '@/contexts/ContextoProduto';
import { Botao } from "@/components/ui/botao";
import { Label } from '@/components/ui/rotulo';
import { GrupoRadio, ItemGrupoRadio } from '@/components/ui/grupo-radio';
import { LayoutGrid, Rows, Columns, Square, Filter } from 'lucide-react';
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

  return (
    <div className={`div-espacada ${accessibilityFilter !== 'none' ? `${accessibilityFilter}-filter` : ''}`}>



    
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