'use client';

import React, { useState, useEffect } from 'react';
import StaticHeader from '../../components/layout/StaticHeader';
import AcademicsBackground from '../../components/academics_page/AcademicsBackground';
import AcademicsContent from '../../components/academics_page/AcademicsContent';
import Footer from '../../components/layout/Footer'
import NoDataModal from '../../components/common/NoDataModal';

export default function AcademicsPage() {
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    const userInfoStr = sessionStorage.getItem('userInfo');
    const hasUserInfo = !!userInfoStr;
    setHasData(hasUserInfo);
  }, []);

  return (
    <div className="w-full min-h-screen" style={{ 
      backgroundColor: 'var(--background)',
      background: 'linear-gradient(to bottom, var(--background) 0%, rgba(245, 245, 245, 0.5) 100%)'
    }}>
      <StaticHeader />
      
      <div className="w-full" style={{
        background: 'linear-gradient(135deg, #F5F5F5 0%, #E8E8F0 100%)',
        minHeight: 'calc(100vh - 80px)',
        position: 'relative',
        paddingTop: '200px',
        paddingBottom: '30px',
        filter: !hasData ? 'blur(4px)' : 'none',
        pointerEvents: !hasData ? 'none' : 'auto',
        transition: 'filter 0.3s ease'
      }}>
        <AcademicsBackground />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
          <AcademicsContent />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
      
      <NoDataModal isOpen={!hasData} />
      
      <Footer></Footer>
    </div>
  );
}
