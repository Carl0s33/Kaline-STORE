import React, { useState, useEffect } from 'react';
    import { Botao } from '@/components/ui/botao';
    import { ArrowUp } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    const ScrollToTopButton = () => {
      const [isVisible, setIsVisible] = useState(false);

      const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };

      const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      };

      useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
          window.removeEventListener('scroll', toggleVisibility);
        };
      }, []);

      return (
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <Botao
                onClick={scrollToTop}
                size="icon"
                className="btn-primary-kaline rounded-full shadow-lg h-12 w-12 sm:h-14 sm:w-14"
                aria-label="Voltar ao topo"
              >
                <ArrowUp className="h-6 w-6 sm:h-7 sm:w-7" />
              </Botao>
            </motion.div>
          )}
        </AnimatePresence>
      );
    };

    export default ScrollToTopButton;