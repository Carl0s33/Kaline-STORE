import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Botao } from '@/components/ui/botao';
import { useAuth } from '@/contexts/ContextoAutenticacao';
import { useNotificacao } from '@/components/ui/useNotificacao';
import { motion } from 'framer-motion';
import { LogIn as Entrar, Eye, EyeOff, AlertTriangle, UserCheck, Briefcase } from 'lucide-react';
import { Label } from '@/components/ui/rotulo';
import { GrupoRadio, ItemGrupoRadio } from '@/components/ui/grupo-radio';

// ==============================
// PÁGINA DE LOGIN - ONDE A DIVERSÃO COMEÇA
// ou termina, dependendo se vc lembra a senha
// #esqueciminhasenha #naoeh1234
// ==============================
// aviso: contém código feito na pressa
// se funcionar, foi sorte
// se não funcionar, tenta 'admin/admin'
const LoginPage = () => {
  // ===== ESTADOS =====
  // a parte que ninguem gosta de fazer
  // mas tem que ter senao nao funciona
  // #reactExigente #queriaquefosseoprimeiro
  
  // email que vc jurou que lembrava
  // mas na verdade usou aquele do ensino medio
  const [email, setEmail] = useState('');
  
  // senha que vc acha que é a certa
  // mas ja tentou 3 vezes e ta bloqueado
  const [password, setPassword] = useState('');
  
  // tipo de perfil: cliente ou vendedor
  // escolhe errado e se ferrou
  // #escolhaserio #naotemvolta
  const [profileType, setProfileType] = useState('customer');
  
  // mostrar senha? so se tiver sozinho
  // ou se nao ligar pra privacidade mesmo
  // #senhavisivel #fodase
  const [showPassword, setShowPassword] = useState(false);
  
  // estado de carregamento
  // aquele loading que nunca acaba
  // #carregando #vaitravarnovamente
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ===== HOOKS =====
  // a magia negra do react
  // se der pau, chuta o balde
  
  // hook pra navegar entre paginas
  // tipo o maps, mas menos util
  const navigate = useNavigate();
  
  // hook pra pegar a localizacao
  // nao, nao é o gps do seu celular
  // #naoestoutevigiando #mentira
  const location = useLocation();
  
  // pega as funcoes de autenticacao
  // se nao tiver, fudeu
  // #tentedenovo #botaumalert
  const { login, user } = useAuth();
  
  // hook pra mostrar notificacoes
  // aqueles popups chatos que ninguem le
  // #fechar #fechar #fechar
  
  // efeito que mostra mensagem de redirecionamento
  // tipo quando vc tenta entrar sem estar logado
  // e aparece 'faça login primeiro' como se vc nao soubesse
  const { notificar } = useNotificacao();

  const messageFromState = location.state?.message;

  useEffect(() => {
    if (messageFromState) {
      notificar({
        title: "Ei, peraí!",
        description: messageFromState,
        variant: "destructive",
        duration: 5000,
        icon: <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
      });
    }
  }, [messageFromState, notificar]);

  // Efeito que redireciona o usuário logado
  // (porque ninguém merece ficar na página de login já logado)
  useEffect(() => {
    if (user) {
      // Se veio de alguma página, volta pra lá. Se não, vai pra dashboard ou home
      const destino = location.state?.from?.pathname || 
                    (user.role === 'seller' ? '/vendedor/painel' : '/');
      
      // Navega para o destino (e limpa o histórico pra não ficar em loop)
      navigate(destino, { replace: true });
    }
  }, [user, navigate, location.state]);

  // Função que tenta fazer login
  // Se der errado, a culpa é do usuário (sempre)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impece o formulário de dar refresh na página
    setIsSubmitting(true); // Ativa o loading (aquela rodinha que gira)
    
    // Validação básica (porque confiar no usuário é pedir pra ter dor de cabeça)
    if (!email || !password) {
      notificar({ 
        title: "Ei, tá faltando algo!", 
        description: "Preencha email e senha, por favor. Não é tão difícil assim.", 
        variant: "destructive", 
        duration: 3000 
      });
      setIsSubmitting(false); // Desativa o loading
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        let userData = null;
        if (profileType === 'customer' && email === 'cliente@gmail.com' && password === 'cliente123') {
          userData = { id: 'user1', name: 'Cliente', email, role: 'customer' };
        } else if (profileType === 'seller' && email === 'vendedor@gmail.com' && password === 'vendedor123') {
          userData = { id: 'seller1', name: 'Vendedor', email, role: 'seller' };
        }

        if (userData) {
          login(userData);
          notificar({ title: "Login bem-sucedido!", description: `Bem-vindo(a) de volta, ${userData.name}!`, duration: 2500 });
          
        } else {
          notificar({ title: "Ops!", description: "Não é você, sou eu ;(", variant: "destructive", duration: 3000 });
        }
        setIsSubmitting(false);
      };

      return (
        <motion.div
          key="login-page"
          initial={{ opacity: 0, y: 20 }}  // Começa invisível e um pouco pra baixo
          animate={{ opacity: 1, y: 0 }}   // Vem pra cima suavemente
          exit={{ opacity: 0, y: -20 }}    // Sai pra baixo suavemente
          transition={{ duration: 0.3 }}    // Duração da animação
          className="div-container flex flex-col items-center justify-center min-h-screen"
        >
          {/* Card de login com animação suave */}
          <div className="div-destaque div-arredondada div-sombra w-full max-w-md p-6 sm:p-8 bg-brand-card-kaline dark:bg-card">
            <div className="div-centralizada div-espacada">
              <div className="text-center mb-6 sm:mb-8">
                <Entrar className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-brand-primary-kaline mb-3" />
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-text-kaline dark:text-brand-text-kaline">Acessar Conta</h1>
                <p className="text-sm text-brand-text-muted-kaline dark:text-muted-foreground mt-1">
                  Bem-vindo(a) de volta à Kaline Store!
                </p>
              </div>

              {/* Formulário de login - onde a mágica (ou o desespero) acontece */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <Label htmlFor="profileType" className="text-sm font-medium text-brand-text-kaline dark:text-brand-text-kaline mb-1.5 block">Tipo de Perfil</Label>
                  <GrupoRadio 
                    id="profileType"
                    value={profileType} 
                    onValueChange={setProfileType} 
                    className="grid grid-cols-2 gap-2 sm:gap-3"
                    aria-label="Selecione o tipo de perfil"
                  >
                    <div>
                      <ItemGrupoRadio value="customer" id="customer" className="sr-only" />
                      <Label 
                        htmlFor="customer"
                        className={`flex items-center justify-center p-2.5 border rounded-md text-xs sm:text-sm cursor-pointer transition-all ${profileType === 'customer' ? 'bg-brand-primary-kaline text-primary-foreground border-brand-primary-kaline ring-2 ring-brand-primary-kaline ring-offset-1' : 'bg-background hover:bg-muted border-input'}`}
                      >
                        <UserCheck className="mr-1.5 h-4 w-4" /> Cliente
                      </Label>
                    </div>
                    <div>
                      <ItemGrupoRadio value="seller" id="seller" className="sr-only" />
                      <Label 
                        htmlFor="seller"
                        className={`flex items-center justify-center p-2.5 border rounded-md text-xs sm:text-sm cursor-pointer transition-all ${profileType === 'seller' ? 'bg-brand-primary-kaline text-primary-foreground border-brand-primary-kaline ring-2 ring-brand-primary-kaline ring-offset-1' : 'bg-background hover:bg-muted border-input'}`}
                      >
                         <Briefcase className="mr-1.5 h-4 w-4" /> Vendedor
                      </Label>
                    </div>
                  </GrupoRadio>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-brand-text-kaline dark:text-brand-text-kaline">Email</Label>
                  <input
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
                <div className="div-espacada">
                  <Label htmlFor="password" className="text-sm font-medium text-brand-text-kaline dark:text-brand-text-kaline">Senha</Label>
                  <input
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
                  <Botao
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 bottom-1 h-8 w-8 text-brand-text-muted-kaline hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Botao>
                </div>
                <Botao type="submit" className="w-full btn-primary-kaline rounded-md text-sm sm:text-base py-2.5" disabled={isSubmitting}>
                  {isSubmitting ? 'Entrando...' : 'Entrar'}
                </Botao>
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
          </div>
        </motion.div>
      );
    };

    export default LoginPage;