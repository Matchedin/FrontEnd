'use client';

export default function PortfolioBackground() {
  return (
    <>
      {/* Single subtle wave at top */}
      <svg
        style={{
          position: 'fixed',
          top: '8%',
          left: 0,
          width: '100%',
          height: '150px',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.6
        }}
        viewBox="0 0 1200 120"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.02)" />
          </linearGradient>
        </defs>
        <path
          d="M0,60 Q300,40 600,60 T1200,60 L1200,120 L0,120 Z"
          fill="url(#grad1)"
        />
      </svg>

      {/* Floating Orb - Top Right */}
      <div
        style={{
          position: 'fixed',
          top: '12%',
          right: '-8%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'float 22s ease-in-out infinite',
          willChange: 'transform'
        }}
      />

      {/* Floating Orb - Bottom Left */}
      <div
        style={{
          position: 'fixed',
          bottom: '10%',
          left: '-8%',
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'float 26s ease-in-out infinite reverse',
          willChange: 'transform'
        }}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-40px); }
        }
      `}</style>
    </>
  );
}
