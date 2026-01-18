'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StaticHeader from '../../components/layout/StaticHeader';
import PortfolioBackground from '../../components/portfolio_page/PortfolioBackground';
import PortfolioHeader from '../../components/portfolio_page/PortfolioHeader';
import ConnectionTypes from '../../components/portfolio_page/ConnectionTypes';
import ResumeInsights from '../../components/portfolio_page/ResumeInsights';
import Footer from '../../components/layout/Footer';
import NoDataModal from '../../components/common/NoDataModal';
import { ConnectionData } from '@/data/connectionData';

export default function PortfolioPage() {
  const [connectionTypes, setConnectionTypes] = useState<Record<string, number>>({});
  const [connectionData, setConnectionData] = useState<ConnectionData[]>([]);
  const [resumeText, setResumeText] = useState('');
  const [userInfo, setUserInfo] = useState<{ name: string; school: string } | null>(null);
  const [hasData, setHasData] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<'network' | 'insights'>('network');

  // Check for user data on client-side mount
  useEffect(() => {
    const userInfoStr = sessionStorage.getItem('userInfo');
    const hasUserInfo = !!userInfoStr;
    console.log('Portfolio checking - userInfo exists:', hasUserInfo);
    setHasData(hasUserInfo);
    setIsChecked(true);
  }, []);

  // Load session storage data
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const connectionsDataStr = sessionStorage.getItem('connectionsData');
    const userInfoStr = sessionStorage.getItem('userInfo');

    const info = userInfoStr ? JSON.parse(userInfoStr) : null;
    let connections: ConnectionData[] = [];
    const typeCounts: Record<string, number> = {};

    if (connectionsDataStr) {
      try {
        connections = JSON.parse(connectionsDataStr) as ConnectionData[];
        
        connections.forEach(conn => {
          const type = conn.industry || conn.current_role || 'Other';
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
      } catch (error) {
        console.error('Failed to parse connections data:', error);
      }
    }

    // Check if there's meaningful data
    const hasUserInfo = !!info;
    
    console.log('Portfolio data loaded - hasUserInfo:', hasUserInfo);
    
    setUserInfo(info);
    setConnectionData(connections);
    setConnectionTypes(typeCounts);
    setHasData(hasUserInfo);
  }, []);

  // Load resume text
  useEffect(() => {
    const loadResume = async () => {
      try {
        const response = await fetch('/api/get-resume');
        if (response.ok) {
          const data = await response.json();
          setResumeText(data.text || '');
        }
      } catch (error) {
        console.error('Failed to load resume:', error);
      }
    };

    loadResume();
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
          paddingTop: '60px',
          paddingBottom: '100px',
          filter: isChecked && !hasData ? 'blur(4px)' : 'none',
          pointerEvents: isChecked && !hasData ? 'none' : 'auto',
          transition: 'filter 0.3s ease'
        }}>
        <PortfolioBackground />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <PortfolioHeader userInfo={userInfo} />

          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '48px',
            marginBottom: '32px'
          }}>
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '4px',
              border: '1px solid rgba(69, 103, 204, 0.2)',
              boxShadow: '0 4px 16px rgba(69, 103, 204, 0.1)'
            }}>
              <button
                onClick={() => setActiveTab('network')}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === 'network' ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' : 'transparent',
                  color: activeTab === 'network' ? '#ffffff' : 'var(--foreground)',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🌐 Network
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === 'insights' ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' : 'transparent',
                  color: activeTab === 'insights' ? '#ffffff' : 'var(--foreground)',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📊 Insights
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div style={{ marginTop: '24px' }}>
            {activeTab === 'network' && (
              <ConnectionTypes industryMatches={connectionTypes} />
            )}
            {activeTab === 'insights' && (
              <ResumeInsights resumeText={resumeText} connectionData={connectionData} />
            )}
          </div>
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
      `}</style>

      <NoDataModal isOpen={isChecked && !hasData} />

      <Footer />
    </motion.div>
  );
}
