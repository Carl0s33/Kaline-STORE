import React from 'react';
    import { Link } from 'react-router-dom';
    import { Instagram, Facebook, Twitter } from 'lucide-react';
    import { Botao } from '@/components/ui/botao';
    import { Entrada } from '@/components/ui/entrada';

    const Footer = () => {
      return (
        <footer className="bg-brand-card-kaline dark:bg-black border-t border-border/40 py-8 sm:py-12 mt-12 sm:mt-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <p className="font-heading text-xl font-semibold text-brand-primary-kaline mb-3">Kaline Store</p>
                <p className="text-sm text-brand-text-muted-kaline leading-relaxed">
                  Sua moda com acessibilidade e estilo.
                </p>
              </div>
              <div>
                <p className="font-semibold text-brand-text-kaline mb-3">Atendimento</p>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-brand-text-muted-kaline hover:text-brand-primary-kaline transition-colors">Fale Conosco</a></li>
                  <li><a href="#" className="text-brand-text-muted-kaline hover:text-brand-primary-kaline transition-colors">Trocas e Devoluções</a></li>
                  <li><a href="#" className="text-brand-text-muted-kaline hover:text-brand-primary-kaline transition-colors">Perguntas Frequentes</a></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-brand-text-kaline mb-3">Institucional</p>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/about" className="text-brand-text-muted-kaline hover:text-brand-primary-kaline transition-colors">Sobre Nós</Link></li>
                  <li><a href="#" className="text-brand-text-muted-kaline hover:text-brand-primary-kaline transition-colors">Política de Privacidade</a></li>
                  <li><a href="#" className="text-brand-text-muted-kaline hover:text-brand-primary-kaline transition-colors">Termos de Uso</a></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-brand-text-kaline mb-3">Newsletter</p>
                <p className="text-sm text-brand-text-muted-kaline mb-2">Receba novidades e promoções!</p>
                <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Entrada type="email" placeholder="Seu e-mail" className="bg-brand-background-kaline dark:bg-input flex-grow rounded-md text-sm" aria-label="Email para newsletter"/>
                  <Botao type="submit" variant="default" className="btn-primary-kaline rounded-md text-sm">
                    Assinar
                  </Botao>
                </form>
              </div>
            </div>
            <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-xs sm:text-sm text-brand-text-muted-kaline mb-4 sm:mb-0 text-center sm:text-left">
                &copy; {new Date().getFullYear()} Kaline Store. Todos os direitos reservados.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/carlosdu.03/" target="_blank" rel="noopener noreferrer" aria-label="Instagram Kaline Store" className="text-brand-text-muted-kaline hover:text-brand-primary-kaline transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" aria-label="Facebook Kaline Store" className="text-brand-text-muted-kaline hover:text-brand-primary-kaline transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="https://x.com/el_duduzinho" target="_blank" rel="noopener noreferrer" aria-label="Twitter Kaline Store" className="text-brand-text-muted-kaline hover:text-brand-primary-kaline transition-colors">
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </footer>
      );
    };
    
    export default Footer;