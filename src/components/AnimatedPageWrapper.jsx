import React from 'react';
import { motion } from 'framer-motion';

const AnimatedPageWrapper = ({ children, className = "" }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1
      }
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    in: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    out: { opacity: 0 }
  };

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
    >
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="in"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedPageWrapper;
