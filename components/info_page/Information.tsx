'use client';

import React from 'react';
import InfoForm from './InfoForm';
import InfoAnimation from './InfoAnimation';

export default function Information() {
  return (
    <div style={{ display: 'flex', gap: '48px', padding: '48px', maxWidth: '1400px', margin: '0 auto', alignItems: 'stretch' }}>
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
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f9fafb'
        }}
      >
        <InfoAnimation />
      </div>
    </div>
  );
}
