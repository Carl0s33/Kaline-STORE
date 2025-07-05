import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  Sun, 
  Moon, 
  Menu, 
  Search, 
  User, 
  LogOut, 
  Settings, 
  Cog,
  ChevronDown,
  Contrast,
  Type,
  Minus,
  Plus,
  Ear,
  EarOff,
  Check
} from 'lucide-react';
import { Botao } from '@/components/ui/botao';
import { Entrada } from "@/components/ui/entrada"
import { Label } from "@/components/ui/rotulo"
import { GrupoRadio, ItemGrupoRadio } from "@/components/ui/grupo-radio"
import { Interruptor } from "@/components/ui/interruptor"
import { useTheme } from '@/contexts/ContextoTema';
import { useAuth } from '@/contexts/ContextoAutenticacao';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger, 
  DropdownMenuSub, 
  DropdownMenuSubTrigger, 
  DropdownMenuSubContent, 
  DropdownMenuPortal 
} from "@/components/ui/menu-suspenso";
import { motion } from 'framer-motion';


const navLinks = [
  { to: "/category/novidades", label: "Novidades" },
  { to: "/category/vestidos", label: "Vestidos" },
  { to: "/category/camisetas", label: "Camisetas" },
  { to: "/category/calcas", label: "Calças" },
  { to: "/category/saias", label: "Saias" },
  { to: "/category/shorts", label: "Shorts" },
  { to: "/category/blusas", label: "Blusas" },
  { to: "/category/conjuntos", label: "Conjuntos" },
  { to: "/category/calcados", label: "Calçados" },
  { to: "/category/acessorios", label: "Acessórios" },
  { to: "/category/promocoes", label: "Promoções" },
];

const Header = () => {
  const { 
    theme, 
    toggleTheme, 
    highContrast, 
    toggleHighContrast,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    screenReader,
    toggleScreenReader
  } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [colorFilter, setColorFilter] = useState('none');

  // Categorias de produtos estáticas (substitua por suas categorias reais se necessário)
  const productCategories = [];

  useEffect(() => {
    const root = document.documentElement;

    root.style.filter = '';

    switch (colorFilter) {
      case 'protanopia':
        root.style.filter = 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'protanopia\'><feColorMatrix in=\'SourceGraphic\' type=\'matrix\' values=\'0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0\'/></filter></svg>#protanopia")';
        break;
      case 'deuteranopia':
        root.style.filter = 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'deuteranopia\'><feColorMatrix in=\'SourceGraphic\' type=\'matrix\' values=\'0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0\'/></filter></svg>#deuteranopia")';
        break;
      case 'tritanopia':
        root.style.filter = 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'tritanopia\'><feColorMatrix in=\'SourceGraphic\' type=\'matrix\' values=\'0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0\'/></filter></svg>#tritanopia")';
        break;
      case 'achromatopsia':
        root.style.filter = 'grayscale(100%)';
        break;
      default:
        break;
    }
  }, [colorFilter]);

  const activeLinkClass = "text-brand-primary-kaline font-semibold border-b-2 border-brand-primary-kaline";
  const inactiveLinkClass = "hover:text-brand-primary-kaline transition-colors duration-300";

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-brand-background-kaline/95 dark:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-brand-background-kaline/60 dark:supports-[backdrop-filter]:bg-background/60 shadow-sm"
    >
      <div className="w-full flex h-16 items-center justify-between px-2 sm:px-4 gap-2">

        <Link to="/" className="flex-shrink-0 text-2xl sm:text-3xl font-heading font-bold text-brand-primary-kaline" aria-label="Página Inicial da Kaline Store">
          Kaline Store
        </Link>

        <nav className="hidden sm:flex items-center gap-x-2 md:space-x-4 lg:space-x-6" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${isActive ? activeLinkClass : inactiveLinkClass} text-sm font-medium whitespace-nowrap`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Botao variant="ghost" className="flex items-center gap-1 text-sm font-medium text-brand-text-muted-kaline hover:text-brand-text-kaline">
                Categorias
                <ChevronDown className="h-4 w-4" />
              </Botao>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-brand-card-kaline dark:bg-card">
              {productCategories.map(category => (
                <DropdownMenuItem key={category} asChild className="cursor-pointer hover:bg-brand-secondary-kaline/10 dark:hover:bg-accent/10">
                  <Link to={`/category/${encodeURIComponent(category)}`} className="w-full">{category}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
          <Botao 
            variant="ghost" 
            size="icon" 
            className="rounded-full p-2 text-brand-text-kaline hover:bg-brand-primary-kaline/10 hover:text-brand-primary-kaline"
            aria-label="Buscar produtos"
          >
            <Search className="h-5 w-5" />
          </Botao>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Botao 
                variant="outline" 
                size="icon" 
                className="relative rounded-full bg-brand-primary-kaline/10 hover:bg-brand-primary-kaline/20 border-brand-primary-kaline/30 p-1.5 sm:p-2" 
                aria-label="Opções de acessibilidade"
              >
                <Cog className="h-6 w-6 text-brand-primary-kaline animate-pulse" />
              </Botao>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-brand-card-kaline dark:bg-card mt-2 p-3">
              <DropdownMenuLabel className="text-brand-primary-kaline px-2 py-1.5 text-base font-semibold">Acessibilidade</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-4 p-2">
                <div className="flex items-center justify-between w-full">
                  <Label htmlFor="dark-mode-toggle-dropdown" className="text-sm text-brand-text-kaline dark:text-brand-text-muted-kaline font-medium">Modo Escuro</Label>
                  <div className="flex items-center space-x-1">
                    {theme === 'dark' ? <Moon className="h-4 w-4 mr-1" /> : <Sun className="h-4 w-4 mr-1" />}
                    <Interruptor
                      id="dark-mode-toggle-dropdown"
                      checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}
                      aria-label="Alternar modo escuro"
                      className="data-[state=checked]:bg-brand-primary-kaline data-[state=unchecked]:bg-input"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between w-full">
                  <Label htmlFor="high-contrast-toggle" className="text-sm text-brand-text-kaline dark:text-brand-text-muted-kaline font-medium flex items-center">
                    <Contrast className="h-4 w-4 mr-2" />
                    Alto Contraste
                  </Label>
                  <Interruptor
                    id="high-contrast-toggle"
                    checked={highContrast}
                    onCheckedChange={toggleHighContrast}
                    aria-label="Alternar alto contraste"
                    className="data-[state=checked]:bg-brand-primary-kaline data-[state=unchecked]:bg-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-brand-text-kaline dark:text-brand-text-muted-kaline font-medium flex items-center">
                    <Type className="h-4 w-4 mr-2" />
                    Tamanho da Fonte
                  </Label>
                  <div className="flex items-center justify-between">
                    <Botao 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={decreaseFontSize}
                      aria-label="Diminuir tamanho da fonte"
                    >
                      <Minus className="h-4 w-4" />
                    </Botao>
                    <span className="text-sm">{fontSize}px</span>
                    <Botao 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={increaseFontSize}
                      aria-label="Aumentar tamanho da fonte"
                    >
                      <Plus className="h-4 w-4" />
                    </Botao>
                    <Botao 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs" 
                      onClick={resetFontSize}
                    >
                      Padrão
                    </Botao>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Label htmlFor="screen-reader-toggle" className="text-sm text-brand-text-kaline dark:text-brand-text-muted-kaline font-medium flex items-center">
                    {screenReader ? <EarOff className="h-4 w-4 mr-2" /> : <Ear className="h-4 w-4 mr-2" />}
                    Leitor de Tela
                  </Label>
                  <Interruptor
                    id="screen-reader-toggle"
                    checked={screenReader}
                    onCheckedChange={toggleScreenReader}
                    aria-label="Alternar leitor de tela"
                    className="data-[state=checked]:bg-brand-primary-kaline data-[state=unchecked]:bg-input"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Label className="text-sm text-brand-text-kaline dark:text-brand-text-muted-kaline font-medium">Acessibilidade Visual</Label>
                  <p className="text-xs text-brand-text-muted-kaline">Filtro de Cor:</p>
                  <GrupoRadio value={colorFilter} onValueChange={setColorFilter} className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <ItemGrupoRadio value="none" id="filter-none" />
                      <Label htmlFor="filter-none" className="text-sm cursor-pointer">Nenhum</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ItemGrupoRadio value="protanopia" id="filter-protanopia" />
                      <Label htmlFor="filter-protanopia" className="text-sm cursor-pointer">Protanopia</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ItemGrupoRadio value="deuteranopia" id="filter-deuteranopia" />
                      <Label htmlFor="filter-deuteranopia" className="text-sm cursor-pointer">Deuteranopia</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ItemGrupoRadio value="tritanopia" id="filter-tritanopia" />
                      <Label htmlFor="filter-tritanopia" className="text-sm cursor-pointer">Tritanopia</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ItemGrupoRadio value="achromatopsia" id="filter-achromatopsia" />
                      <Label htmlFor="filter-achromatopsia" className="text-sm cursor-pointer">Acromático</Label>
                    </div>
                  </GrupoRadio>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/favorites" aria-label="Ver produtos favoritos">
            <Botao variant="ghost" size="icon" className="rounded-full hover:bg-brand-secondary-kaline/20 dark:hover:bg-accent/20 p-1.5 sm:p-2">
              <Heart className="h-5 w-5 text-brand-text-kaline dark:text-brand-text-muted-kaline" />
            </Botao>
          </Link>
          <Link to="/cart" aria-label="Ver carrinho de compras">
            <Botao variant="ghost" size="icon" className="rounded-full hover:bg-brand-secondary-kaline/20 dark:hover:bg-accent/20 p-1.5 sm:p-2 relative">
              <ShoppingCart className="h-5 w-5 text-brand-text-kaline dark:text-brand-text-muted-kaline" />
              {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span> */}
            </Botao>
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Botao variant="ghost" size="icon" className="rounded-full hover:bg-brand-secondary-kaline/20 dark:hover:bg-accent/20 p-1.5 sm:p-2" aria-label="Menu do usuário">
                  <User className="h-5 w-5 text-brand-text-kaline dark:text-brand-text-muted-kaline" />
                </Botao>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-brand-card-kaline dark:bg-card mt-2">
                <DropdownMenuLabel className="text-brand-text-muted-kaline px-2 py-1.5 text-sm font-normal">Olá, {user.name}!</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(user.role === 'seller' ? '/seller/dashboard' : '/profile')} className="cursor-pointer hover:bg-brand-secondary-kaline/10 dark:hover:bg-accent/10">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Meu Painel</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:bg-red-500/10 focus:text-red-600 focus:bg-red-500/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <div className="hidden md:flex">
                <Botao asChild variant="ghost" size="sm" className="inline-flex hover:bg-brand-secondary-kaline/20 dark:hover:bg-accent/20 text-brand-text-kaline dark:text-brand-text-muted-kaline px-2 py-1 text-xs sm:text-sm">
                  <Link to="/login">Login</Link>
                </Botao>
              </div>
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Botao variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Abrir menu</span>
                    </Botao>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-brand-card-kaline dark:bg-card mt-2">
                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-brand-secondary-kaline/10 dark:hover:bg-accent/10">
                      <Link to="/login" className="w-full">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="cursor-pointer hover:bg-brand-secondary-kaline/10 dark:hover:bg-accent/10">
                        <span>Categorias</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="bg-brand-card-kaline dark:bg-card">
                          {productCategories.map(category => (
                            <DropdownMenuItem key={category} asChild className="cursor-pointer hover:bg-brand-secondary-kaline/10 dark:hover:bg-accent/10">
                              <Link to={`/category/${encodeURIComponent(category)}`}>{category}</Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </div>
      </motion.header>
  );
};

export default Header;