'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header 
      style={{
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        backgroundColor: `#4567CC`,
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
      <Link href="/" className="absolute left-1/2 transform -translate-x-1/2" style={{fontSize: '2rem', textDecoration: 'none', cursor: 'pointer'}}>
        <h1 style={{color: 'white', margin: 0, transition: 'opacity 0.3s'}} 
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          MatchedIn
        </h1>
      </Link>

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
