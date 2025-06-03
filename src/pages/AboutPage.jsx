import React from 'react';
    import { motion } from 'framer-motion';
    import { Users, Accessibility, Sparkles, HeartHandshake } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';

    const AboutPage = () => {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4 py-8 space-y-12"
        >
          <header className="text-center space-y-4">
            <Sparkles className="mx-auto h-16 w-16 text-brand-primary-kaline" />
            <h1 className="text-4xl sm:text-5xl font-bold font-heading text-brand-text-kaline dark:text-brand-text-kaline">
              Sobre a Kaline Store
            </h1>
            <p className="text-lg sm:text-xl text-brand-text-muted-kaline dark:text-muted-foreground max-w-2xl mx-auto text-balance">
              Nossa missão é oferecer moda elegante, confortável e, acima de tudo, acessível para todos.
            </p>
          </header>

          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                alt="Equipe diversificada da Kaline Store colaborando em um ambiente de trabalho inclusivo e alegre."
                className="rounded-lg shadow-xl object-cover aspect-video w-full"
               src="https://images.unsplash.com/photo-1677328395852-8cf73cf9bc2b" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-semibold font-heading text-brand-text-kaline dark:text-brand-text-kaline">Nossa Proposta</h2>
              <p className="text-brand-text-muted-kaline dark:text-muted-foreground leading-relaxed">
                Na Kaline Store, acreditamos que a moda deve ser uma forma de expressão pessoal, disponível para todos, independentemente de suas habilidades ou necessidades. Nosso compromisso é criar uma experiência de compra online que seja verdadeiramente inclusiva.
              </p>
              <p className="text-brand-text-muted-kaline dark:text-muted-foreground leading-relaxed">
                Desde a concepção de nossas peças até a navegação em nosso site, cada detalhe é pensado para garantir conforto, estilo e facilidade de uso. Queremos que você se sinta confiante e maravilhosa com nossas roupas!
              </p>
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-semibold font-heading text-brand-text-kaline dark:text-brand-text-kaline text-center">Nossos Valores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                { icon: Accessibility, title: "Acessibilidade Primeiro", description: "Design e funcionalidade pensados para todos, com foco em navegação intuitiva e recursos de acessibilidade." },
                { icon: Users, title: "Inclusão e Diversidade", description: "Celebramos a beleza em todas as suas formas, oferecendo uma variedade de tamanhos e estilos." },
                { icon: HeartHandshake, title: "Empoderamento", description: "Queremos que nossas clientes se sintam confiantes e poderosas em suas próprias peles." },
              ].map((value, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-6 bg-brand-card-kaline dark:bg-card rounded-lg shadow-lg text-center space-y-3"
                >
                  <value.icon className="mx-auto h-10 w-10 text-brand-primary-kaline mb-2" />
                  <h3 className="text-xl font-semibold text-brand-text-kaline dark:text-brand-text-kaline">{value.title}</h3>
                  <p className="text-sm text-brand-text-muted-kaline dark:text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="text-center">
             <h2 className="text-2xl sm:text-3xl font-semibold font-heading text-brand-text-kaline dark:text-brand-text-kaline mb-4">Junte-se a Nós</h2>
             <p className="text-brand-text-muted-kaline dark:text-muted-foreground max-w-xl mx-auto mb-6">
               Explore nossa coleção e descubra uma nova forma de vivenciar a moda, com mais inclusão e estilo.
             </p>
             <Button asChild size="lg" className="btn-primary-kaline rounded-md">
               <Link to="/">Ver Produtos</Link>
             </Button>
          </section>

        </motion.div>
      );
    };

    export default AboutPage;