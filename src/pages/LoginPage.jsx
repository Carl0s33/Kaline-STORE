import React, { useState, useEffect } from 'react';
    import { useNavigate, Link, useLocation } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useAuth } from '@/contexts/AuthContext';
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from 'framer-motion';
    import { Eye, EyeOff, LogIn, AlertTriangle, UserCheck, Briefcase } from 'lucide-react';
    import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

    const LoginPage = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [profileType, setProfileType] = useState('customer'); // 'customer' or 'seller'
      const [showPassword, setShowPassword] = useState(false);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const navigate = useNavigate();
      const location = useLocation();
      const { login, user } = useAuth();
      const { toast } = useToast();

      const messageFromState = location.state?.message;

      useEffect(() => {
        if (messageFromState) {
          toast({
            title: "Atenção!",
            description: messageFromState,
            variant: "destructive",
            duration: 5000,
            icon: <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
          });
        }
      }, [messageFromState, toast]);
      
      useEffect(() => {
        if (user) {
          const from = location.state?.from?.pathname || (user.role === 'seller' ? '/seller/dashboard' : '/');
          navigate(from, { replace: true });
        }
      }, [user, navigate, location.state]);


      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (!email || !password) {
          toast({ title: "Erro", description: "Por favor, preencha todos os campos.", variant: "destructive", duration: 3000 });
          setIsSubmitting(false);
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        let userData = null;
        if (profileType === 'customer' && email === 'cliente@kaline.com' && password === 'cliente123') {
          userData = { id: 'user1', name: 'Cliente Kaline', email, role: 'customer' };
        } else if (profileType === 'seller' && email === 'vendedor@kaline.com' && password === 'vendedor123') {
          userData = { id: 'seller1', name: 'Vendedor Kaline', email, role: 'seller' };
        }

        if (userData) {
          login(userData);
          toast({ title: "Login bem-sucedido!", description: `Bem-vindo(a) de volta, ${userData.name}!`, duration: 2500 });
          // Navigation is handled by the useEffect above
        } else {
          toast({ title: "Erro de Login", description: "Email, senha ou tipo de perfil inválidos.", variant: "destructive", duration: 3000 });
        }
        setIsSubmitting(false);
      };

      return (
        <motion.div
          key="login-page"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-4 py-8"
        >
          <div className="w-full max-w-md p-6 sm:p-8 bg-brand-card-kaline dark:bg-card rounded-xl shadow-2xl">
            <div className="text-center mb-6 sm:mb-8">
              <LogIn className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-brand-primary-kaline mb-3" />
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-text-kaline dark:text-brand-text-kaline">Acessar Conta</h1>
              <p className="text-sm text-brand-text-muted-kaline dark:text-muted-foreground mt-1">
                Bem-vindo(a) de volta à Kaline Store!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <Label htmlFor="profileType" className="text-sm font-medium text-brand-text-kaline dark:text-brand-text-kaline mb-1.5 block">Tipo de Perfil</Label>
                <RadioGroup 
                  id="profileType"
                  value={profileType} 
                  onValueChange={setProfileType} 
                  className="grid grid-cols-2 gap-2 sm:gap-3"
                  aria-label="Selecione o tipo de perfil"
                >
                  <div>
                    <RadioGroupItem value="customer" id="customer" className="sr-only" />
                    <Label 
                      htmlFor="customer"
                      className={`flex items-center justify-center p-2.5 border rounded-md text-xs sm:text-sm cursor-pointer transition-all ${profileType === 'customer' ? 'bg-brand-primary-kaline text-primary-foreground border-brand-primary-kaline ring-2 ring-brand-primary-kaline ring-offset-1' : 'bg-background hover:bg-muted border-input'}`}
                    >
                      <UserCheck className="mr-1.5 h-4 w-4" /> Cliente
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="seller" id="seller" className="sr-only" />
                    <Label 
                      htmlFor="seller"
                      className={`flex items-center justify-center p-2.5 border rounded-md text-xs sm:text-sm cursor-pointer transition-all ${profileType === 'seller' ? 'bg-brand-primary-kaline text-primary-foreground border-brand-primary-kaline ring-2 ring-brand-primary-kaline ring-offset-1' : 'bg-background hover:bg-muted border-input'}`}
                    >
                       <Briefcase className="mr-1.5 h-4 w-4" /> Vendedor
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-brand-text-kaline dark:text-brand-text-kaline">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={profileType === 'customer' ? "cliente@kaline.com" : "vendedor@kaline.com"}
                  className="mt-1 bg-background dark:bg-input rounded-md text-sm"
                  required
                  aria-required="true"
                  autoComplete="email"
                />
              </div>
              <div className="relative">
                <Label htmlFor="password" className="text-sm font-medium text-brand-text-kaline dark:text-brand-text-kaline">Senha</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={profileType === 'customer' ? "cliente123" : "vendedor123"}
                  className="mt-1 bg-background dark:bg-input rounded-md text-sm pr-10"
                  required
                  aria-required="true"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 bottom-1 h-8 w-8 text-brand-text-muted-kaline hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
              <Button type="submit" className="w-full btn-primary-kaline rounded-md text-sm sm:text-base py-2.5" disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
            <p className="mt-6 text-center text-xs sm:text-sm text-brand-text-muted-kaline dark:text-muted-foreground">
              Não tem uma conta?{' '}
              <Link to="/register" className="font-medium text-brand-primary-kaline hover:underline">
                Cadastre-se
              </Link>
            </p>
             <p className="mt-2 text-center text-xs text-brand-text-muted-kaline dark:text-muted-foreground">
              <Link to="/forgot-password" className="font-medium text-brand-primary-kaline hover:underline">
                Esqueceu a senha?
              </Link>
            </p>
          </div>
        </motion.div>
      );
    };

    export default LoginPage;