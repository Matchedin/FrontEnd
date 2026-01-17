'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [scrollOpacity, setScrollOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const opacity = Math.min(scrollPosition / 300, 1);
      setScrollOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        backgroundColor: `#4567CC${Math.round(scrollOpacity * 0.99 * 255).toString(16).padStart(2, '0').toUpperCase()}`,
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background-color 0.1s ease'
      }}
    >
      {/* Left Side - Navigation Buttons */}
      <nav style={{ display: 'flex', gap: '24px', marginLeft: '30px', fontSize: '1.3rem'}}>
        <Link
          href="#about"
          style={{ color: 'white', fontWeight: '500', cursor: 'pointer', transition: 'opacity 0.3s', textDecoration: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          About
        </Link>
        <Link
          href="#connect"
          style={{ color: 'white', fontWeight: '500', cursor: 'pointer', transition: 'opacity 0.3s', textDecoration: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Connect
        </Link>
        <Link
          href="/network"
          style={{ color: 'white', fontWeight: '500', cursor: 'pointer', transition: 'opacity 0.3s', textDecoration: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Network
        </Link>
        <Link
          href="/info"
          style={{ color: 'white', fontWeight: '500', cursor: 'pointer', transition: 'opacity 0.3s', textDecoration: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Info
        </Link>
      </nav>

      {/* Center - Logo/Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2" style={{fontSize: '2rem'}}>
        <h1 style={{color: 'var(--background)'}}>MatchedIn</h1>
      </div>

      {/* Right Side - Logo */}
      <div className="ml-auto" style={{marginRight: '40px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', display: 'flex', padding: 0}}>
        <Image
          src="/images/MatchedIn_Logo.svg"
          alt="MatchedIn Logo"
          width={50}
          height={50}
          style={{display: 'block'}}
        />
      </div>
    </header>
  );
}
