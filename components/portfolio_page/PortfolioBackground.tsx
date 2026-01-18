'use client';

export default function PortfolioBackground() {
  return (
    <>
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
    </>
  );
}
