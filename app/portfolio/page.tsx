'use client';

import React, { useState, useEffect } from 'react';
import StaticHeader from '../../components/layout/StaticHeader';
import PortfolioBackground from '../../components/portfolio_page/PortfolioBackground';
import PortfolioHeader from '../../components/portfolio_page/PortfolioHeader';
import ConnectionTypes from '../../components/portfolio_page/ConnectionTypes';
import ResumeCharacteristics from '../../components/portfolio_page/ResumeCharacteristics';
import StrengthsAndImprovements from '../../components/portfolio_page/StrengthsAndImprovements';
import Footer from '../../components/layout/Footer';
import { ConnectionData } from '@/data/connectionData';

export default function PortfolioPage() {
  const [connectionTypes, setConnectionTypes] = useState<Record<string, number>>({});
  const [connectionData, setConnectionData] = useState<ConnectionData[]>([]);
  const [resumeText, setResumeText] = useState('');
  const [userInfo, setUserInfo] = useState<{ name: string; school: string } | null>(null);

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

    setUserInfo(info);
    setConnectionData(connections);
    setConnectionTypes(typeCounts);
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
    <div className="w-full min-h-screen" style={{
      backgroundColor: 'var(--background)',
      background: 'linear-gradient(to bottom, var(--background) 0%, rgba(245, 245, 245, 0.5) 100%)'
    }}>
      <StaticHeader />

      <div className="w-full" style={{
        background: 'linear-gradient(135deg, #F5F5F5 0%, #E8E8F0 100%)',
        minHeight: 'calc(100vh - 80px)',
        position: 'relative',
        paddingTop: '60px',
        paddingBottom: '100px'
      }}>
        <PortfolioBackground />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <PortfolioHeader userInfo={userInfo} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', marginTop: '48px' }}>
            <ConnectionTypes industryMatches={connectionTypes} />
            <ResumeCharacteristics resumeText={resumeText} />
            <StrengthsAndImprovements connectionData={connectionData} />
          </div>
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
      `}</style>

      <Footer />
    </div>
  );
}
