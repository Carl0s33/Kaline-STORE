import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Cabecalho';
import Footer from './Rodape';
import { Toaster } from '@/components/ui/notificador';
import ScrollToTopButton from './BotaoVoltarAoTopo';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen bg-brand-background-kaline text-brand-text-kaline dark:bg-background dark:text-foreground">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-grow container mx-auto px-3 sm:px-4 py-6 sm:py-8"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <Toaster />
      <ScrollToTopButton />
      <SVGAccessibilityFilters />
    </div>
  );
};

// SVG filters for color blindness simulation
const SVGAccessibilityFilters = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <defs>
      <filter id="protanopia">
        <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0" />
      </filter>
      <filter id="deuteranopia">
        <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0" />
      </filter>
      <filter id="tritanopia">
        <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0" />
      </filter>
      <filter id="achromatopsia">
        <feColorMatrix type="matrix" values="0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0,0,0,1,0" />
      </filter>
    </defs>
  </svg>
);

export default Layout;