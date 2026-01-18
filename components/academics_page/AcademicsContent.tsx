'use client';

import React, { useState } from 'react';
import ResumeReview from './ResumeReview';
import PDFViewer from './PDFViewer';
import ClassesPanel from './ClassesPanel';
import { useClassRecommendations } from '@/hooks/useClassRecommendations';

export default function AcademicsContent() {
  const [activeTab, setActiveTab] = useState<'resume' | 'classes'>('resume');
  const [pdfPath, setPdfPath] = useState<string>('');
  
  // Use the class recommendations hook for lazy loading
  // The hook automatically loads recommendations when resume data is available
  const classRecommendations = useClassRecommendations();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '32px',
      minHeight: '700px'
    }}>
      {/* Left Side - Forms */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('resume')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'resume' 
                ? 'linear-gradient(135deg, var(--primary) 0%, rgba(69, 103, 204, 0.8) 100%)'
                : 'rgba(255, 255, 255, 0.6)',
              color: activeTab === 'resume' ? 'white' : 'rgba(32, 32, 32, 0.8)',
              border: activeTab === 'resume' 
                ? '1px solid rgba(69, 103, 204, 0.3)'
                : '1px solid rgba(69, 103, 204, 0.15)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontSize: '0.95rem',
              backdropFilter: 'blur(10px)',
              boxShadow: activeTab === 'resume' 
                ? '0 4px 12px rgba(69, 103, 204, 0.2)'
                : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'resume') {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.8)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'resume') {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.6)';
              }
            }}
          >
            Resume Review
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'classes' 
                ? 'linear-gradient(135deg, var(--accent) 0%, rgba(196, 65, 185, 0.8) 100%)'
                : 'rgba(255, 255, 255, 0.6)',
              color: activeTab === 'classes' ? 'white' : 'rgba(32, 32, 32, 0.8)',
              border: activeTab === 'classes' 
                ? '1px solid rgba(196, 65, 185, 0.3)'
                : '1px solid rgba(196, 65, 185, 0.15)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontSize: '0.95rem',
              backdropFilter: 'blur(10px)',
              boxShadow: activeTab === 'classes' 
                ? '0 4px 12px rgba(196, 65, 185, 0.2)'
                : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'classes') {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.8)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'classes') {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.6)';
              }
            }}
          >
            Class Recommendations
          </button>
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto'
        }}>
          {activeTab === 'resume' && <ResumeReview onPdfPathChange={setPdfPath} />}
          {activeTab === 'classes' && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '48px',
              border: '1px solid rgba(196, 65, 185, 0.3)',
              boxShadow: '0 20px 60px rgba(196, 65, 185, 0.1)',
              animation: 'slideUp 0.6s ease-out'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: 'var(--foreground)',
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: '0 0 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                Classes for Your Skills
              </h2>
              <p style={{
                fontSize: '0.95rem',
                color: 'rgba(32, 32, 32, 0.7)',
                marginBottom: '24px',
                lineHeight: '1.6',
                margin: '0 0 24px 0'
              }}>
                Based on your resume, here are recommended classes to develop your skills.
              </p>
              
              {classRecommendations.isLoading && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(196, 65, 185, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '48px 32px',
                  border: '1px solid rgba(196, 65, 185, 0.2)',
                  textAlign: 'center',
                  marginBottom: '24px'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px', animation: 'pulse 2s ease-in-out infinite' }}>🔍</div>
                  <p style={{ margin: '0', fontSize: '1.1rem', color: 'rgba(32, 32, 32, 0.7)', fontWeight: '500' }}>Searching for the best classes for you...</p>
                </div>
              )}
              
              {!classRecommendations.isLoading && classRecommendations.recommendations.length > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(196, 65, 185, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '32px',
                  border: '2px solid rgba(196, 65, 185, 0.4)',
                  boxShadow: '0 8px 32px rgba(196, 65, 185, 0.15)',
                  marginBottom: '24px',
                  animation: 'slideUp 0.6s ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ 
                      fontSize: '2.5rem',
                      filter: 'brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1200%) hue-rotate(250deg)'
                    }}>
                      🎓
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        margin: '0 0 8px 0',
                        color: 'var(--accent)',
                      }}>
                        Top Recommendation
                      </h3>
                      <h4 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        margin: '0 0 12px 0',
                        color: 'var(--foreground)',
                      }}>
                        {classRecommendations.recommendations[0]?.className}
                      </h4>
                      <p style={{
                        fontSize: '0.95rem',
                        color: 'rgba(32, 32, 32, 0.7)',
                        lineHeight: '1.6',
                        margin: 0
                      }}>
                        {classRecommendations.recommendations[0]?.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {!classRecommendations.isLoading && classRecommendations.recommendations.length === 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(196, 65, 185, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '48px 32px',
                  border: '1px dashed rgba(196, 65, 185, 0.3)',
                  textAlign: 'center',
                  marginBottom: '24px'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
                  <p style={{ margin: '0', fontSize: '1rem', color: 'rgba(32, 32, 32, 0.6)' }}>No classes found. Please ensure you have uploaded your resume.</p>
                </div>
              )}
              
              {!classRecommendations.isLoading && classRecommendations.error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#dc2626',
                  fontSize: '0.875rem'
                }}>
                  ⚠️ {classRecommendations.error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Side - PDF/Classes Viewer */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '18px',
        padding: '24px',
        border: '1px solid rgba(69, 103, 204, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        height: 'fit-content',
        position: 'sticky',
        top: '20px',
        marginTop: '65px'
      }}>
        {activeTab === 'resume' && <PDFViewer filePath={pdfPath} />}
        {activeTab === 'classes' && <ClassesPanel classes={classRecommendations.recommendations} isLoading={classRecommendations.isSearching} />}
      </div>
    </div>
  );
}
