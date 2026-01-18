'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ResumeReview from './ResumeReview';
import { useClassRecommendations } from '@/hooks/useClassRecommendations';

export default function AcademicsContent() {
  const [activeTab, setActiveTab] = useState<'resume' | 'classes'>('resume');
  const classRecommendations = useClassRecommendations();

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      padding: '32px',
      border: '1px solid rgba(0, 0, 0, 0.05)'
    }}>
      {/* Content */}
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
              flex: 1,
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
              flex: 1,
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
          {activeTab === 'resume' && <ResumeReview />}
          {activeTab === 'classes' && (
            <div>
              {classRecommendations.isLoading && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '48px',
                  border: '1px solid rgba(196, 65, 185, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '500', color: 'rgba(32, 32, 32, 0.7)' }}>Loading class recommendations...</p>
                </div>
              )}

              {!classRecommendations.isLoading && classRecommendations.recommendations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ marginTop: '24px' }}>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      marginBottom: '32px',
                      color: 'var(--foreground)',
                      background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      margin: '0 0 32px 0'
                    }}>
                      Recommended Classes
                    </motion.h3>

                  <div style={{ display: 'flex', gap: '32px', minHeight: '650px' }}>
                    {/* LEFT: Top Recommendation */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      style={{ flex: '0 0 48%' }}>
                      {classRecommendations.recommendations[0] && (
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(196, 65, 185, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: '16px',
                          padding: '40px',
                          border: '1px solid rgba(196, 65, 185, 0.4)',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease'
                        }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(196, 65, 185, 0.3)';
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Top Recommendation</span>
                          </div>
                          <h4 style={{
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            marginBottom: '20px',
                            color: 'var(--accent)',
                            margin: '0 0 20px 0',
                            lineHeight: '1.3'
                          }}>
                            {classRecommendations.recommendations[0].className}
                          </h4>
                          <p style={{
                            fontSize: '1rem',
                            color: 'rgba(32, 32, 32, 0.8)',
                            lineHeight: '1.7',
                            margin: 0
                          }}>
                            {classRecommendations.recommendations[0].description}
                          </p>
                        </div>
                      )}
                    </motion.div>

                    {/* RIGHT: Other Classes - Scrollable */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      style={{ flex: '0 0 48%' }}>
                      {classRecommendations.recommendations.length > 1 && (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                          height: '100%',
                          maxHeight: '650px',
                          overflowY: 'auto',
                          paddingRight: '8px'
                        }}>
                          {classRecommendations.recommendations.slice(1).map((classItem, i) => (
                            <motion.div
                              key={i + 1}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                              style={{
                                background: 'linear-gradient(135deg, rgba(196, 65, 185, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '1px solid rgba(196, 65, 185, 0.25)',
                                transition: 'all 0.3s ease',
                                flexShrink: 0
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(196, 65, 185, 0.2)';
                                (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
                                (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(196, 65, 185, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)';
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                                (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                                (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(196, 65, 185, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)';
                              }}
                            >
                              <h5 style={{
                                fontSize: '1.05rem',
                                fontWeight: '700',
                                marginBottom: '10px',
                                color: 'var(--accent)',
                                margin: '0 0 10px 0',
                                lineHeight: '1.3'
                              }}>
                                {classItem.className}
                              </h5>
                              <p style={{
                                fontSize: '0.85rem',
                                color: 'rgba(32, 32, 32, 0.75)',
                                lineHeight: '1.5',
                                margin: 0,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {classItem.description}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {!classRecommendations.isLoading && classRecommendations.recommendations.length === 0 && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '48px',
                  border: '1px solid rgba(196, 65, 185, 0.3)',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(32, 32, 32, 0.7)' }}>No classes found. Please upload your resume to get recommendations.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
