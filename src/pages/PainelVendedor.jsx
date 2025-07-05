import React from 'react';
    import { motion } from 'framer-motion';
    import { Botao } from '@/components/ui/botao';
    import { Link } from 'react-router-dom';
    import { PackagePlus, ListOrdered, BarChart3, Settings } from 'lucide-react';

    const SellerDashboardPage = () => {
    
      const stats = [
        { label: "Total de Produtos", value: "120", icon: ListOrdered },
        { label: "Vendas no Mês", value: "R$ 12.500,00", icon: BarChart3 },
        { label: "Novos Pedidos", value: "15", icon: PackagePlus },
      ];

      const actions = [
        { label: "Adicionar Produto", icon: PackagePlus, path: "/seller/products/new" },
        { label: "Gerenciar Produtos", icon: ListOrdered, path: "/seller/products" },
        { label: "Ver Pedidos", icon: PackagePlus, path: "/seller/orders" },
        { label: "Configurações da Loja", icon: Settings, path: "/seller/settings" },
      ];

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="div-container div-espacada"
        >
          <header className="div-espacada">
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-brand-text-kaline dark:text-brand-text-kaline">
              Painel do Vendedor
            </h1>
            <Botao className="btn-primary-kaline rounded-md" asChild>
              <Link to="/seller/products/new">
                <PackagePlus className="mr-2 h-5 w-5" /> Adicionar Novo Produto
              </Link>
            </Botao>
          </header>

       
          <section className="div-espacada">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="div-destaque div-arredondada div-sombra flex items-center space-x-4"
              >
                <stat.icon className="h-10 w-10 text-brand-primary-kaline" />
                <div>
                  <p className="text-sm text-brand-text-muted-kaline dark:text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold text-brand-text-kaline dark:text-brand-text-kaline">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </section>

         
          <section>
            <h2 className="text-2xl font-semibold font-heading text-brand-text-kaline dark:text-brand-text-kaline mb-4">
              Ações Rápidas
            </h2>
            <div className="div-espacada">
              {actions.map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to={action.path} className="block p-6 bg-brand-card-kaline dark:bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center focus:outline-none focus:ring-2 focus:ring-brand-primary-kaline focus:ring-offset-2">
                    <action.icon className="mx-auto h-12 w-12 text-brand-primary-kaline mb-3" />
                    <p className="font-medium text-brand-text-kaline dark:text-brand-text-kaline">{action.label}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          
          <section>
            <h2 className="text-2xl font-semibold font-heading text-brand-text-kaline dark:text-brand-text-kaline mb-4">
              Atividade Recente (Exemplo)
            </h2>
            <div className="div-destaque div-arredondada div-sombra">
              <p className="text-brand-text-muted-kaline dark:text-muted-foreground">
                Aqui seriam listados os pedidos recentes ou produtos com baixo estoque.
                Funcionalidade a ser implementada.
              </p>
            </div>
          </section>

        </motion.div>
      );
    };

    export default SellerDashboardPage;