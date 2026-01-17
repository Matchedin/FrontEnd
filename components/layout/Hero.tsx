'use client';

import Button from '../common/Button';

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/Hero_Video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full" style={{flexDirection: 'column'}}>
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-center" style={{color: 'var(--background)', fontSize: '5rem'}}>
          Discover Your Network
        </h1>
        <span style={{color: 'var(--background)', fontSize: '4rem'}}>Build connections that guide your career</span>
        <div style={{display: 'flex', gap: '20px', marginTop: '40px'}}>
          <Button
            size="lg"
            variant="solid"
            colorScheme="primary"
            onClick={() => window.location.href = '#connect'}
          >
            Start Here
          </Button>
          <Button
            size="lg"
            variant="outline"
            colorScheme="primary"
            onClick={() => window.location.href = '#connect'}
          >
            Send More Info
          </Button>
        </div>
      </div>
    </section>
  );
}
