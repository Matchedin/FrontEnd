'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#connect', label: 'Connect' },
    { href: '/network', label: 'Network' },
    { href: '/info', label: 'Info' },
    { href: '/academics', label: 'Academics' },
  ];

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
    >
      {/* Background layer that fades in */}
      <div 
        className={`
          absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 
          transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${scrolled ? 'opacity-100' : 'opacity-0'}
        `}
      />
      
      {/* Border and shadow container */}
      <div 
        className={`
          absolute inset-0 pointer-events-none
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${scrolled 
            ? 'border-b border-white/20 shadow-[0_8px_32px_rgba(59,130,246,0.3),0_4px_12px_rgba(0,0,0,0.1)]' 
            : 'border-b border-transparent shadow-none'
          }
        `}
      />

      {/* Content wrapper with padding transitions */}
      <div 
        className={`
          relative z-10 w-full flex items-center justify-between
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${scrolled ? 'py-3 px-6' : 'py-5 px-6'}
        `}
      >
        {/* Left Side - Navigation */}
        <nav className="flex gap-6 ml-8 text-lg">
          {navLinks.map((link) => (
            link.href.startsWith('#') ? (
              <a
                key={link.href}
                href={link.href}
                className={`
                  relative text-white font-semibold py-2.5 px-6 rounded-xl
                  transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]
                  overflow-hidden tracking-wide
                  hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/30 hover:shadow-lg
                `}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative text-white font-semibold py-2.5 px-6 rounded-xl
                  transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]
                  overflow-hidden tracking-wide
                  hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/30 hover:shadow-lg
                `}
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>

        {/* Center - Logo/Title */}
        <div className="absolute left-1/2 -translate-x-1/2 text-3xl animate-float">
          <h1 className="m-0 font-bold -tracking-wide bg-gradient-to-br from-white via-indigo-100 to-white bg-[length:200%_200%] bg-clip-text text-transparent animate-shimmer">
            <Link href="/">
              MatchedIn
            </Link>
          </h1>
        </div>

        {/* Right Side - Logo */}
        <div className="ml-auto mr-10 flex p-1 bg-gradient-to-br from-white/20 to-white/5 rounded-xl border border-white/20 animate-glow">
          <Image
            src="/images/MatchedIn_Logo.svg"
            alt="MatchedIn Logo"
            width={50}
            height={50}
            className="block rounded-lg"
          />
        </div>
      </div>
    </header>
  );
}
