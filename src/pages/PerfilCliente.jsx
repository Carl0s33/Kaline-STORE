import React from 'react';
    import { motion } from 'framer-motion';
    import { Botao } from '@/components/ui/botao';
    import { Link } from 'react-router-dom';
    import { User, ShoppingBag, Heart, MapPin, Edit3 } from 'lucide-react';
    import { useAuth } from '@/contexts/ContextoAutenticacao';

    const CustomerProfilePage = () => {
      const { user } = useAuth();

      if (!user) {
        return (
          <div className="div-centralizada div-espacada">
            <p>Você precisa estar logado para ver seu perfil.</p>
            <Botao asChild className="mt-4 btn-primary-kaline">
              <Link to="/login">Fazer Login</Link>
            </Botao>
          </div>
        );
      }

      const profileActions = [
        { label: "Meus Pedidos", icon: ShoppingBag, path: "/profile/orders" },
        { label: "Lista de Desejos", icon: Heart, path: "/favorites" },
        { label: "Endereços Salvos", icon: MapPin, path: "/profile/addresses" },
        { label: "Editar Perfil", icon: Edit3, path: "/profile/edit" },
      ];

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="div-container div-espacada"
        >
          <header className="div-centralizada div-espacada">
            <User className="mx-auto h-16 w-16 text-brand-primary-kaline p-3 bg-brand-secondary-kaline/20 rounded-full" />
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-brand-text-kaline dark:text-brand-text-kaline">
              Olá, {user.name}!
            </h1>
            <p className="text-brand-text-muted-kaline dark:text-muted-foreground">{user.email}</p>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {profileActions.map((action, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, boxShadow: "0 6px 12px rgba(0,0,0,0.07)" }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  to={action.path} 
                  className="flex items-center p-4 sm:p-6 bg-brand-card-kaline dark:bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-primary-kaline focus:ring-offset-2"
                >
                  <action.icon className="h-7 w-7 sm:h-8 sm:w-8 text-brand-primary-kaline mr-3 sm:mr-4" />
                  <span className="font-medium text-brand-text-kaline dark:text-brand-text-kaline text-sm sm:text-base">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </section>
          
          <div className="div-centralizada div-espacada">
            <Botao variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive rounded-md">
              Excluir Conta
            </Botao>
          </div>

        </motion.div>
      );
    };

    export default CustomerProfilePage;