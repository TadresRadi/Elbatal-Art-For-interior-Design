import { motion, easeInOut } from 'framer-motion';

// Animation variants for consistent animations across all pages
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeInOut } },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: easeInOut } },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: easeInOut } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeInOut } },
};

export const scaleIn = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { duration: 0.6 } },
};

export const slideUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeInOut } },
};

// Reusable animated section component
export const AnimatedSection = ({ 
  children, 
  className = "", 
  variants = fadeUp, 
  viewport = { once: true, margin: "-100px" },
  id 
}: {
  children: React.ReactNode;
  className?: string;
  variants?: any;
  viewport?: any;
  id?: string;
}) => {
  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={variants}
    >
      {children}
    </motion.section>
  );
};

// Reusable animated container component
export const AnimatedContainer = ({ 
  children, 
  className = "", 
  variants = fadeUp, 
  viewport = { once: true, margin: "-100px" } 
}: {
  children: React.ReactNode;
  className?: string;
  variants?: any;
  viewport?: any;
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

// Reusable animated heading component
export const AnimatedHeading = ({ 
  children, 
  className = "", 
  variants = fadeUp 
}: {
  children: React.ReactNode;
  className?: string;
  variants?: any;
}) => {
  return (
    <motion.h1
      className={className}
      variants={variants}
    >
      {children}
    </motion.h1>
  );
};

// Reusable animated text component
export const AnimatedText = ({ 
  children, 
  className = "", 
  variants = fadeUp 
}: {
  children: React.ReactNode;
  className?: string;
  variants?: any;
}) => {
  return (
    <motion.p
      className={className}
      variants={variants}
    >
      {children}
    </motion.p>
  );
};

// Reusable animated card component
export const AnimatedCard = ({ 
  children, 
  className = "", 
  variants = fadeUp, 
  viewport = { once: true, margin: "-100px" },
  whileHover = { scale: 1.02 }
}: {
  children: React.ReactNode;
  className?: string;
  variants?: any;
  viewport?: any;
  whileHover?: any;
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={variants}
      whileHover={whileHover}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};
