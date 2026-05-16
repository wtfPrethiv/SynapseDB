"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let start = 0;
    const end = 100;
    const duration = 2200;
    const step = duration / end;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 900);
        }, 300);
      }
    }, step);
    return () => clearInterval(timer);
  }, [onComplete]);

  const panels = [0, 1, 2, 3];

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="preloader"
          className="preloader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Grid noise overlay */}
          <div className="preloader-grid" />

          {/* Brand */}
          <motion.div
            className="preloader-brand"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="preloader-logo">SynapseDB</span>
            <span className="preloader-sub">AI Provenance Platform</span>
          </motion.div>

          {/* Counter */}
          <motion.div
            className="preloader-counter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="preloader-num">{String(count).padStart(3, "0")}</span>
          </motion.div>

          {/* Progress bar */}
          <motion.div className="preloader-bar-wrap">
            <motion.div
              className="preloader-bar"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: count / 100 }}
              style={{ transformOrigin: "left" }}
              transition={{ ease: "linear", duration: 0.05 }}
            />
          </motion.div>

          {/* Loading label */}
          <motion.p
            className="preloader-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.5 }}
          >
            Initializing provenance engine…
          </motion.p>
        </motion.div>
      ) : (
        /* Exit wipe panels */
        <motion.div key="wipe" className="preloader-wipe">
          {panels.map((i) => (
            <motion.div
              key={i}
              className="wipe-panel"
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{
                duration: 0.7,
                delay: i * 0.07,
                ease: [0.76, 0, 0.24, 1],
              }}
              style={{ transformOrigin: "top" }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
