'use client';

import { Profile } from '@/types/profile';
import React, { useState } from 'react';


export default function ConnectionTypes({ industryMatches }: ConnectionTypesProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [industryUsers, setIndustryUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

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
    .slice(0, 8); // Top 8 industries

  const maxPercent = sortedIndustries.length > 0 ? sortedIndustries[0][1] : 100;

  const handleIndustryClick = async (industry: string) => {
    setSelectedIndustry(industry);
    setLoading(true);
    try {
      const res = await fetch(`/api/searchByIndustry?q=${encodeURIComponent(industry)}`);
      const data = await res.json();
      setIndustryUsers(data);
    } catch (err) {
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
      alignItems: 'flex-start'
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
          🏭 Percent Match by Industry
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          overflowY: 'hidden',
        }}>
          {sortedIndustries.length > 0 ? (
            sortedIndustries.map(([industry, percent], i) => (
              <div
                key={industry}
                style={{
                  background: selectedIndustry === industry ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255,255,255,0.7)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: selectedIndustry === industry ? '2px solid var(--accent)' : '1px solid rgba(69, 103, 204, 0.13)',
                  cursor: 'pointer',
                  boxShadow: selectedIndustry === industry ? '0 4px 12px rgba(139, 92, 246, 0.13)' : 'none',
                  transition: 'all 0.2s',
                  animation: `slideUp 0.5s ease-out ${i * 0.08}s backwards`,
                }}
                onClick={() => handleIndustryClick(industry)}
              >
                <div style={{
                  fontSize: '1rem',
                  color: 'rgba(32, 32, 32, 0.8)',
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>{industry}</div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '8px'
                }}>{((percent / maxPercent) * 100).toFixed(1)}%</div>
                <div style={{
                  height: '4px',
                  background: 'rgba(69, 103, 204, 0.13)',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${((percent / maxPercent) * 100).toFixed(1)}%`,
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                    transition: 'width 0.5s ease-out'
                  }} />
                </div>
              </div>
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
      <div style={{ flex: 1, minWidth: '280px', maxWidth: '400px', background: 'rgba(255,255,255,0.8)', borderRadius: '12px', padding: '18px', border: '1px solid rgba(69, 103, 204, 0.10)', boxShadow: '0 2px 8px rgba(69, 103, 204, 0.07)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px', color: 'var(--accent)' }}>
          {selectedIndustry ? `Users in ${selectedIndustry}` : 'Select an industry'}
        </h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {industryUsers.length > 0 ? (
              industryUsers.map((user: Profile) => (
                <div
                  key={user.profileId}
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
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.15)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139, 92, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.08)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139, 92, 246, 0.15)';
                  }}
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
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'rgba(32, 32, 32, 0.6)',
                fontSize: '1rem'
              }}>
                {selectedIndustry ? 'No users found in this industry.' : 'Select an industry to view users.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
