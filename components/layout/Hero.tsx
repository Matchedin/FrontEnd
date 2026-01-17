'use client';

import Link from 'next/link';

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

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        {/* Badge */}
        <span className="inline-block text-sm font-semibold text-white/90 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20 animate-fade-in">
          AI-Powered Networking
        </span>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center leading-tight mb-6 [filter:drop-shadow(0_4px_12px_rgba(0,0,0,0.4))_drop-shadow(0_8px_24px_rgba(0,0,0,0.3))]">
          <span className="block text-white">
            Discover Your<br/>
            Network
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl lg:text-3xl text-white/80 text-center max-w-3xl mb-10 leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          Build connections that guide your career
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="#connect"
            className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            <span>Start Now</span>
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <Link
            href="#about"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/40 transition-all duration-300"
          >
            <span>Learn More</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <span className="text-sm">Scroll to explore</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
