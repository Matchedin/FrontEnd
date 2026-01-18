'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {

  const navLinks = [
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/network', label: 'Network' },
    { href: '/academics', label: 'Academics' },
    { href: '/info', label: 'Info' },
  ];

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{paddingTop: '5px', paddingBottom: '5px'}}
    >
      {/* Background layer that fades in */}
      <div 
        className={`
          absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 
          transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        `}
      />
      
      {/* Border and shadow container */}
      <div 
        className={`
          absolute inset-0 pointer-events-none
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        `}
      />

      {/* Content wrapper with padding transitions */}
      <div 
        className={`
          relative z-10 w-full flex items-center justify-between
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        `}
      >
        {/* Left Side - Navigation */}
        <nav className="flex gap-6 ml-8 text-lg">
          {navLinks.map((link) => (
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
          ))}
        </nav>

        {/* Center - Logo/Title */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-3xl animate-float cursor-pointer hover:opacity-80 transition-opacity">
          <h1 className="m-0 font-bold -tracking-wide bg-gradient-to-br from-white via-indigo-100 to-white bg-[length:200%_200%] bg-clip-text text-transparent animate-shimmer">
            MatchedIn
          </h1>
        </Link>

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
