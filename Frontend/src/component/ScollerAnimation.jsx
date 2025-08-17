// ScrollReveal.js
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const ScrollAnimation = ({ children, from = "left", delay = 0 }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => ref.current && observer.unobserve(ref.current);
  }, []);

  const directions = {
    left: { x: -100, opacity: 0 },
    right: { x: 100, opacity: 0 },
    bottom: { y: 100, opacity: 0 },
    top: { y: -100, opacity: 0 },
    none: { opacity: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={directions[from]}
      animate={visible ? { x: 0, y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.9, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;