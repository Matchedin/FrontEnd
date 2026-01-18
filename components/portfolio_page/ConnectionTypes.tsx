'use client';

import { Profile } from '@/types/profile';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


export default function ConnectionTypes({ industryMatches }: ConnectionTypesProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [industryUsers, setIndustryUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  const containerVariants = {
    hidden: { transition: { staggerChildren: 0.04 } },
    show: { transition: { staggerChildren: 0.06 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 }
  };

  if (!industryMatches) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: 'rgba(32, 32, 32, 0.6)',
        fontSize: '1rem',
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '12px',
        border: '1px solid rgba(69, 103, 204, 0.10)',
        boxShadow: '0 2px 8px rgba(69, 103, 204, 0.07)'
      }}>
        No industry match data available.
      </div>
    );
  }

  const sortedIndustries = Object.entries(industryMatches)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6); // Top 6 industries

  const maxPercent = sortedIndustries.length > 0 ? sortedIndustries[0][1] : 100;

  const handleIndustryClick = async (industry: string) => {
    setSelectedIndustry(industry);
    setLoading(true);
    try {
      const res = await fetch(`/api/searchByIndustry?q=${encodeURIComponent(industry)}`);
      const data = await res.json();
      setIndustryUsers(data);
    } catch (err) {
      console.log(err)
      setIndustryUsers([]);
    }
    setLoading(false);
  };

  return (
    <div style={{
      display: 'flex',
      gap: '32px',
      background: 'linear-gradient(135deg, rgba(69, 103, 204, 0.07) 0%, rgba(139, 92, 246, 0.07) 100%)',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid rgba(69, 103, 204, 0.15)',
      boxShadow: '0 4px 16px rgba(69, 103, 204, 0.07)',
      alignItems: 'flex-start',
      width: '100%',
      maxWidth: '1300px',
      margin: '0 auto'
    }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: 'var(--foreground)',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Percent Match by Industry
        </h2>
        <p style={{
          fontSize: '1rem',
          color: 'rgba(32, 32, 32, 0.7)',
          marginBottom: '18px',
          lineHeight: '1.5'
        }}>
          See how closely your profile matches top industries. Click an industry to view users in that field.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 180px)',
          gridAutoRows: '160px',
          gap: '28px',
          overflowY: 'hidden',
          justifyContent: 'center',
          justifyItems: 'center'
        }}>
          {sortedIndustries.length > 0 ? (
            sortedIndustries.map(([industry, percent], i) => (
              <motion.div
                key={industry}
                style={{
                    background: selectedIndustry === industry ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255,255,255,0.7)',
                    borderRadius: '12px',
                    width: '180px',
                    height: '160px',
                    padding: '12px',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    border: selectedIndustry === industry ? '2px solid var(--accent)' : '1px solid rgba(69, 103, 204, 0.13)',
                    cursor: 'pointer',
                    boxShadow: selectedIndustry === industry ? '0 4px 12px rgba(139, 92, 246, 0.13)' : 'none',
                    transition: 'all 0.2s',
                    animation: `slideUp 0.5s ease-out ${i * 0.08}s backwards`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
                onClick={() => handleIndustryClick(industry)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                whileHover={{ scale: 1.02 }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    background: selectedIndustry === industry ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' : 'rgba(255,255,255,0.88)',
                    color: selectedIndustry === industry ? 'white' : 'rgba(32,32,32,0.85)',
                    fontSize: '1rem',
                    fontWeight: 500,
                    boxShadow: selectedIndustry === industry ? '0 6px 18px rgba(139,92,246,0.12)' : '0 1px 6px rgba(0,0,0,0.04)',
                    maxWidth: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>{industry}</div>
                </div>
                <div style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '6px'
                }}>{((percent / maxPercent) * 100).toFixed(1)}%</div>
                <div style={{
                  height: '6px',
                  width: '80%',
                  background: 'rgba(69, 103, 204, 0.13)',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${((percent / maxPercent) * 100).toFixed(1)}%`,
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                    transition: 'width 0.5s ease-out'
                  }} />
                </div>
              </motion.div>
            ))
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '24px',
              color: 'rgba(32, 32, 32, 0.6)'
            }}>
              No industry matches found.
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: '85px', alignSelf: 'flex-start', position: 'sticky', top: '96px', flex: 1, minWidth: '280px', maxWidth: '400px', background: 'rgba(255,255,255,0.8)', borderRadius: '12px', padding: '18px', border: '1px solid rgba(69, 103, 204, 0.10)', boxShadow: '0 2px 8px rgba(69, 103, 204, 0.07)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px', color: 'var(--accent)' }}>
          {selectedIndustry ? `Users in ${selectedIndustry}` : 'Select an industry'}
        </h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndustry ?? 'none'}
              style={{ maxHeight: '420px', overflowY: 'auto' }}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              {industryUsers.length > 0 ? (
                industryUsers.map((user: Profile) => (
                  <motion.div
                    key={user.profileId}
                    variants={itemVariants}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.28 }}
                    style={{
                      marginBottom: '16px',
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(139, 92, 246, 0.15)',
                      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.08)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    whileHover={{ translateY: -4, boxShadow: '0 8px 20px rgba(139,92,246,0.15)', scale: 1.01 }}
                  >
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: 'var(--foreground)',
                      marginBottom: '6px',
                      background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {user.name || 'Unnamed User'}
                    </div>
                    <div style={{
                      fontSize: '0.95rem',
                      color: 'rgba(32, 32, 32, 0.8)',
                      marginBottom: '4px',
                      fontWeight: '500',
                      lineHeight: '1.4'
                    }}>
                      {user.headline || user.roleCurrent || 'Professional'}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: 'rgba(32, 32, 32, 0.6)',
                      fontWeight: '400'
                    }}>
                      {user.currentCompany ? `🏢 ${user.currentCompany}` : 'Company not specified'}
                    </div>
                    {user.location && (
                      <div style={{
                        fontSize: '0.8rem',
                        color: 'rgba(32, 32, 32, 0.5)',
                        marginTop: '4px'
                      }}>
                        📍 {user.location}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: 'rgba(32, 32, 32, 0.6)',
                    fontSize: '1rem'
                  }}
                >
                  {selectedIndustry ? 'No users found in this industry.' : 'Select an industry to view users.'}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
