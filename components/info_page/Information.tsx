'use client';

import React from 'react';
import InfoForm from './InfoForm';
import InfoAnimation from './InfoAnimation';

export default function Information() {
  return (
    <div style={{ display: 'flex', gap: '48px', padding: '48px', maxWidth: '1400px', margin: '0 auto', alignItems: 'stretch', marginTop: '60px' }}>
      {/* Left side - Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minWidth: '0'
        }}
      >
        <InfoForm />
      </div>

      {/* Right side - Animation */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '600px',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(69, 103, 204, 0.2)',
          boxShadow: '0 8px 32px rgba(69, 103, 204, 0.1)'
        }}
      >
        <InfoAnimation />
      </div>
    </div>
  );
}
