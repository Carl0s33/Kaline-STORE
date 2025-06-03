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
  Cog 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator, 
  DropdownMenuLabel 
} from "@/components/ui/dropdown-menu";
import { motion } from 'framer-motion';

const navLinks = [
  { to: "/category/novidades", label: "Novidades" },
  { to: "/category/vestidos", label: "Vestidos" },
  { to: "/category/acessorios", label: "Acessórios" },
  { to: "/category/promocoes", label: "Promoções" },
];

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [colorFilter, setColorFilter] = useState('none');

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
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-2xl sm:text-3xl font-heading font-bold text-brand-primary-kaline" aria-label="Página Inicial da Kaline Store">
          Kaline Store
        </Link>

        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${isActive ? activeLinkClass : inactiveLinkClass} text-sm font-medium`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-brand-secondary-kaline/20 dark:hover:bg-accent/20" aria-label="Buscar produtos">
            <Search className="h-5 w-5 text-brand-text-kaline dark:text-brand-text-muted-kaline" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="relative rounded-full bg-brand-primary-kaline/10 hover:bg-brand-primary-kaline/20 border-brand-primary-kaline/30" 
                aria-label="Opções de acessibilidade"
              >
                <Cog className="h-6 w-6 text-brand-primary-kaline animate-pulse" />
                <span className="absolute -top-1 -right-1 bg-brand-primary-kaline text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">A</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-brand-card-kaline dark:bg-card mt-2 p-3">
              <DropdownMenuLabel className="text-brand-primary-kaline px-2 py-1.5 text-base font-semibold">Acessibilidade</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="space-y-4 p-2">
                <div className="flex items-center justify-between w-full">
                  <Label htmlFor="dark-mode-toggle-dropdown" className="text-sm text-brand-text-kaline dark:text-brand-text-muted-kaline font-medium">Modo Escuro</Label>
                  <div className="flex items-center space-x-1">
                    {theme === 'dark' ? <Moon className="h-4 w-4 mr-1" /> : <Sun className="h-4 w-4 mr-1" />}
                    <Switch
                      id="dark-mode-toggle-dropdown"
                      checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}
                      aria-label="Alternar modo escuro"
                      className="data-[state=checked]:bg-brand-primary-kaline data-[state=unchecked]:bg-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-brand-text-kaline dark:text-brand-text-muted-kaline font-medium">Acessibilidade Visual</Label>
                  <p className="text-xs text-brand-text-muted-kaline">Filtro de Cor:</p>
                  
                  <RadioGroup value={colorFilter} onValueChange={setColorFilter} className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="filter-none" />
                      <Label htmlFor="filter-none" className="text-sm cursor-pointer">Nenhum</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="protanopia" id="filter-protanopia" />
                      <Label htmlFor="filter-protanopia" className="text-sm cursor-pointer">Protanopia</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="deuteranopia" id="filter-deuteranopia" />
                      <Label htmlFor="filter-deuteranopia" className="text-sm cursor-pointer">Deuteranopia</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tritanopia" id="filter-tritanopia" />
                      <Label htmlFor="filter-tritanopia" className="text-sm cursor-pointer">Tritanopia</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="achromatopsia" id="filter-achromatopsia" />
                      <Label htmlFor="filter-achromatopsia" className="text-sm cursor-pointer">Acromático</Label>
                    </div>
                  </RadioGroup>
                  
                  <p className="text-xs text-brand-text-muted-kaline mt-2 italic">Esta é uma ferramenta de simulação para diferentes tipos de daltonismo.</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/favorites" aria-label="Ver produtos favoritos">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-brand-secondary-kaline/20 dark:hover:bg-accent/20">
              <Heart className="h-5 w-5 text-brand-text-kaline dark:text-brand-text-muted-kaline" />
            </Button>
          </Link>
          <Link to="/cart" aria-label="Ver carrinho de compras">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-brand-secondary-kaline/20 dark:hover:bg-accent/20 relative">
              <ShoppingCart className="h-5 w-5 text-brand-text-kaline dark:text-brand-text-muted-kaline" />
              {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span> */}
            </Button>
          </Link>
          
          {/* Dark mode toggle moved to top navigation */}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-brand-secondary-kaline/20 dark:hover:bg-accent/20" aria-label="Menu do usuário">
                  <User className="h-5 w-5 text-brand-text-kaline dark:text-brand-text-muted-kaline" />
                </Button>
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
            <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex hover:bg-brand-secondary-kaline/20 dark:hover:bg-accent/20 text-brand-text-kaline dark:text-brand-text-muted-kaline">
              <Link to="/login">Login</Link>
            </Button>
          )}

          <div className="md:hidden">
            <DropdownMenu onOpenChange={setIsMobileMenuOpen} open={isMobileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-brand-secondary-kaline/20 dark:hover:bg-accent/20" aria-label="Abrir menu mobile">
                  <Menu className="h-6 w-6 text-brand-text-kaline dark:text-brand-text-muted-kaline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-brand-card-kaline dark:bg-card mt-2">
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm ${isActive ? 'text-brand-primary-kaline font-semibold' : 'text-brand-text-kaline dark:text-brand-text-muted-kaline'}`
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </NavLink>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="sm:hidden focus:bg-transparent">
                  <div className="flex items-center justify-between w-full">
                    <Label htmlFor="dark-mode-toggle-mobile" className="text-sm text-brand-text-kaline dark:text-brand-text-muted-kaline">Modo Escuro</Label>
                    <Switch
                      id="dark-mode-toggle-mobile"
                      checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}
                      aria-label="Alternar modo escuro no mobile"
                      className="data-[state=checked]:bg-brand-primary-kaline data-[state=unchecked]:bg-input"
                    />
                  </div>
                </DropdownMenuItem>
                {!user && (
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="block px-4 py-2 text-sm text-brand-text-kaline dark:text-brand-text-muted-kaline" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;