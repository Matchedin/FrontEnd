'use client';

import React from 'react';
import Link from 'next/link';

interface NoDataModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function NoDataModal({ isOpen }: NoDataModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Blur overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 999,
        }}
      />
      
      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '48px 40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📄</div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#202020',
              margin: '0 0 12px 0',
            }}
          >
            No Data Found
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: '#666',
              margin: '0 0 24px 0',
              lineHeight: '1.6',
            }}
          >
            It looks like you haven&apos;t uploaded your resume and information yet. Please visit the info page to get started.
          </p>
        </div>

        <Link href="/info" style={{ textDecoration: 'none' }}>
          <button
            style={{
              width: '100%',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, var(--primary) 0%, rgba(69, 103, 204, 0.8) 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(69, 103, 204, 0.2)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow =
                '0 6px 20px rgba(69, 103, 204, 0.3)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow =
                '0 4px 12px rgba(69, 103, 204, 0.2)';
            }}
          >
            Go to Info Page
          </button>
        </Link>
      </div>
    </>
  );
}
