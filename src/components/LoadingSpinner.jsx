import React from 'react';
    import { motion } from 'framer-motion';

    const LoadingSpinner = () => {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-brand-background-kaline/80 dark:bg-background/80 backdrop-blur-sm z-[9999]">
          <motion.div 
            className="text-2xl sm:text-3xl font-heading font-bold text-brand-primary-kaline mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Kaline Store
          </motion.div>
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 sm:w-4 sm:h-4 bg-brand-primary-kaline rounded-full"
                animate={{
                  y: ["0%", "-50%", "0%"],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <p className="mt-4 text-sm text-brand-text-muted-kaline">Carregando...</p>
        </div>
      );
    };

    export default LoadingSpinner;