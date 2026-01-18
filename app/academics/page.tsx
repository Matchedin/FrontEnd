'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StaticHeader from '../../components/layout/StaticHeader';
import AcademicsBackground from '../../components/academics_page/AcademicsBackground';
import AcademicsContent from '../../components/academics_page/AcademicsContent';
import Footer from '../../components/layout/Footer'
import NoDataModal from '../../components/common/NoDataModal';

export default function AcademicsPage() {
  const [hasData, setHasData] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const userInfoStr = sessionStorage.getItem('userInfo');
    const hasUserInfo = !!userInfoStr;
    console.log('Academics checking - userInfo exists:', hasUserInfo);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasData(hasUserInfo);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsChecked(true);
  }, []);

  return (
      <motion.div 
        className="w-full min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{ 
          backgroundColor: 'var(--background)',
          background: 'linear-gradient(to bottom, var(--background) 0%, rgba(245, 245, 245, 0.5) 100%)'
        }}>
      <StaticHeader />
      
      <motion.div 
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          background: 'linear-gradient(135deg, #F5F5F5 0%, #E8E8F0 100%)',
          minHeight: 'calc(100vh - 80px)',
          position: 'relative',
          paddingTop: '200px',
          paddingBottom: '30px',
          filter: isChecked && !hasData ? 'blur(4px)' : 'none',
          pointerEvents: isChecked && !hasData ? 'none' : 'auto',
          transition: 'filter 0.3s ease'
        }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
          <AcademicsBackground />
          <AcademicsContent />
        </div>
      </motion.div>

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
      
      <NoDataModal isOpen={isChecked && !hasData} />
      
      <Footer></Footer>
    </motion.div>
  );
}
