'use client';

import { motion } from 'framer-motion';

export default function AcademicsBackground() {
  return (
    <>
      {/* Animated Wave 1 - Sine Wave */}
      <motion.svg
        style={{
          position: 'fixed',
          top: '10%',
          left: '-50%',
          width: '200%',
          height: '800px',
          pointerEvents: 'none',
          zIndex: 0,
          transform: 'translateY(-50%)',
        }}
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <path
          d="M-600,200 Q-300,50 0,200 T600,200 T1200,200 T1800,200"
          stroke="rgba(69, 103, 204, 0.15)"
          strokeWidth="10"
          fill="none"
        />
      </motion.svg>

      {/* Animated Wave 2 - Cosine Wave */}
      <motion.svg
        style={{
          position: 'fixed',
          top: '45%',
          left: '-50%',
          width: '200%',
          height: '800px',
          pointerEvents: 'none',
          zIndex: 0,
          transform: 'translateY(-50%)',
        }}
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <path
          d="M-600,150 Q-300,300 0,150 T600,150 T1200,150 T1800,150"
          stroke="rgba(196, 65, 185, 0.12)"
          strokeWidth="3"
          fill="none"
        />
      </motion.svg>

      {/* Animated Wave 3 - Offset Sine */}
      <motion.svg
        style={{
          position: 'fixed',
          top: '80%',
          left: '-50%',
          width: '200%',
          height: '800px',
          pointerEvents: 'none',
          zIndex: 0,
          transform: 'translateY(-50%)',
        }}
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <path
          d="M-600,180 Q-300,80 0,180 T600,180 T1200,180 T1800,180"
          stroke="rgba(100, 150, 220, 0.08)"
          strokeWidth="2"
          fill="none"
        />
      </motion.svg>

      {/* Animated Wave 4 - Additional wave */}
      <motion.svg
        style={{
          position: 'fixed',
          top: '25%',
          left: '-50%',
          width: '200%',
          height: '800px',
          pointerEvents: 'none',
          zIndex: 0,
          transform: 'translateY(-50%)',
        }}
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <path
          d="M-600,220 Q-300,120 0,220 T600,220 T1200,220 T1800,220"
          stroke="rgba(150, 120, 200, 0.1)"
          strokeWidth="4"
          fill="none"
        />
      </motion.svg>

      {/* Animated Wave 5 - Additional wave */}
      <motion.svg
        style={{
          position: 'fixed',
          top: '60%',
          left: '-50%',
          width: '200%',
          height: '800px',
          pointerEvents: 'none',
          zIndex: 0,
          transform: 'translateY(-50%)',
        }}
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <path
          d="M-600,170 Q-300,270 0,170 T600,170 T1200,170 T1800,170"
          stroke="rgba(100, 180, 220, 0.12)"
          strokeWidth="5"
          fill="none"
        />
      </motion.svg>

      {/* Animated Wave 6 - Additional wave */}
      <motion.svg
        style={{
          position: 'fixed',
          top: '35%',
          left: '-50%',
          width: '200%',
          height: '800px',
          pointerEvents: 'none',
          zIndex: 0,
          transform: 'translateY(-50%)',
        }}
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <path
          d="M-600,190 Q-300,90 0,190 T600,190 T1200,190 T1800,190"
          stroke="rgba(200, 100, 180, 0.08)"
          strokeWidth="3"
          fill="none"
        />
      </motion.svg>

      {/* Animated Wave 7 - Lower wave */}
      <motion.svg
        style={{
          position: 'fixed',
          top: '85%',
          left: '-50%',
          width: '200%',
          height: '800px',
          pointerEvents: 'none',
          zIndex: 0,
          transform: 'translateY(-50%)',
        }}
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <path
          d="M-600,210 Q-300,110 0,210 T600,210 T1200,210 T1800,210"
          stroke="rgba(120, 160, 220, 0.14)"
          strokeWidth="6"
          fill="none"
        />
      </motion.svg>

      {/* Animated Wave 8 - Lower wave */}
      <motion.svg
        style={{
          position: 'fixed',
          top: '70%',
          left: '-50%',
          width: '200%',
          height: '800px',
          pointerEvents: 'none',
          zIndex: 0,
          transform: 'translateY(-50%)',
        }}
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <path
          d="M-600,160 Q-300,260 0,160 T600,160 T1200,160 T1800,160"
          stroke="rgba(180, 140, 200, 0.11)"
          strokeWidth="4"
          fill="none"
        />
      </motion.svg>

      {/* Animated Wave 9 - Lower wave */}
      <motion.svg
        style={{
          position: 'fixed',
          top: '90%',
          left: '-50%',
          width: '200%',
          height: '800px',
          pointerEvents: 'none',
          zIndex: 0,
          transform: 'translateY(-50%)',
        }}
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <path
          d="M-600,195 Q-300,95 0,195 T600,195 T1200,195 T1800,195"
          stroke="rgba(100, 180, 240, 0.1)"
          strokeWidth="5"
          fill="none"
        />
      </motion.svg>

      {/* Floating orbs background */}
      <div
        style={{
          position: 'fixed',
          top: '-50%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(69, 103, 204, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'float 20s ease-in-out infinite'
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(196, 65, 185, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'float 25s ease-in-out infinite reverse'
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'float 30s ease-in-out infinite'
        }}
      />
    </>
  );
}
