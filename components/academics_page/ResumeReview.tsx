'use client';

import React, { useState, useEffect } from 'react';

interface ReviewResult {
  strengths: string[];
  improvements: string[];
  overallScore: number;
  recommendations: string[];
}

interface ResumeReviewProps {
  onPdfPathChange?: (path: string) => void;
}

export default function ResumeReview({ onPdfPathChange }: ResumeReviewProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState<string>('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load resume from temp folder on mount
  useEffect(() => {
    const loadResumeFromTemp = async () => {
      try {
        const response = await fetch('/api/get-resume');
        if (!response.ok) {
          throw new Error('Resume file not found in temp folder');
        }
        const data = await response.json();
        const filename = data.filename || 'resume.docx';
        setResumeName(filename);
        setResumeFile(new File([data.text], filename, { type: 'text/plain' }));
      } catch (err) {
        setError(`Could not find resume file in temp folder${err}`);
        // Silently fail - this is expected when no data has been uploaded
      } finally {
        setIsLoading(false);
      }
    };

    loadResumeFromTemp();
  }, []);

  return (
    <div>
      {!reviewResult ? (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '48px',
          border: '1px solid rgba(69, 103, 204, 0.2)',
          boxShadow: '0 20px 60px rgba(69, 103, 204, 0.1)',
          animation: 'slideUp 0.6s ease-out'
        }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '12px',
              color: 'var(--foreground)',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Get Your Resume Reviewed
            </h2>
            <p style={{
              fontSize: '1.05rem',
              color: 'rgba(32, 32, 32, 0.7)',
              margin: 0,
              lineHeight: '1.6'
            }}>
              Get AI-powered feedback on how to improve your resume
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              color: '#dc2626',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {isLoading ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: 'rgba(32, 32, 32, 0.6)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>⏳</div>
              Loading resume from temp folder...
            </div>
          ) : resumeFile ? (
            <div style={{
              border: '2px solid rgba(69, 103, 204, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              background: 'rgba(69, 103, 204, 0.02)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ fontSize: '1.5rem' }}>📄</div>
              <div>
                <p style={{ fontSize: '0.95rem', fontWeight: '600', margin: '0 0 4px 0', color: 'var(--primary)' }}>
                  {resumeName}
                </p>
                <p style={{ fontSize: '0.85rem', margin: 0, color: 'rgba(32, 32, 32, 0.6)' }}>
                  Ready to review
                </p>
              </div>
            </div>
          ) : null}

          <button
            onClick={async () => {
              setIsReviewing(true);
              setError('');

              try {
                // Show mock review for now
                const mockReview: ReviewResult = {
                  strengths: [
                    'Clear structure and formatting',
                    'Relevant skills highlighted',
                    'Good use of action verbs',
                    'Quantifiable achievements included'
                  ],
                  improvements: [
                    'Add more metrics to technical skills',
                    'Include certifications section',
                    'Expand project descriptions',
                    'Add leadership experience examples'
                  ],
                  overallScore: 78,
                  recommendations: [
                    'Consider adding a professional summary',
                    'Tailor resume to specific job descriptions',
                    'Include links to portfolio or GitHub',
                    'Proofread for any typos or inconsistencies'
                  ]
                };

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                setReviewResult(mockReview);
              } catch (err) {
                setError('Failed to review resume');
                console.error(err);
              } finally {
                setIsReviewing(false);
              }
            }}
            disabled={!resumeFile || isReviewing || isLoading}
            style={{
              width: '100%',
              padding: '14px',
              background: resumeFile && !isReviewing && !isLoading
                ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)'
                : 'rgba(69, 103, 204, 0.3)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: resumeFile && !isReviewing && !isLoading ? 'pointer' : 'not-allowed',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (resumeFile && !isReviewing && !isLoading) {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 16px rgba(69, 103, 204, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (resumeFile && !isReviewing && !isLoading) {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }
            }}
          >
            {isReviewing ? 'Analyzing...' : 'Get Review'}
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              setReviewResult(null);
              setResumeFile(null);
            }}
            style={{
              padding: '12px 24px',
              background: 'rgba(69, 103, 204, 0.1)',
              color: 'var(--primary)',
              border: '1px solid rgba(69, 103, 204, 0.3)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              marginBottom: '32px',
              transition: 'all 0.3s ease',
              fontSize: '0.95rem'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(69, 103, 204, 0.2)';
              (e.currentTarget as HTMLElement).style.transform = 'translateX(-4px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(69, 103, 204, 0.1)';
              (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
            }}
          >
            ← Review Another Resume
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            {/* Score Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(69, 103, 204, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '18px',
              padding: '32px',
              border: '1px solid rgba(69, 103, 204, 0.3)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              animation: 'fadeInUp 0.6s ease-out 0.1s backwards'
            }}>
              <p style={{ fontSize: '0.9rem', color: 'rgba(32, 32, 32, 0.6)', margin: '0 0 16px 0', fontWeight: '500' }}>
                Overall Score
              </p>
              <div style={{
                fontSize: '3.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '8px'
              }}>
                {reviewResult.overallScore}%
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(32, 32, 32, 0.6)', margin: 0 }}>
                Good room for improvement
              </p>
            </div>

            {/* File Info Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(69, 103, 204, 0.1) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '18px',
              padding: '32px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              animation: 'fadeInUp 0.6s ease-out 0.2s backwards'
            }}>
              <p style={{ fontSize: '0.9rem', color: 'rgba(32, 32, 32, 0.6)', margin: '0 0 12px 0', fontWeight: '500' }}>
                File Analyzed
              </p>
              <p style={{ fontSize: '1.1rem', color: 'var(--foreground)', margin: 0, fontWeight: '600' }}>
                {resumeFile?.name}
              </p>
            </div>
          </div>

          {/* Strengths */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.08) 0%, rgba(34, 197, 94, 0.08) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '18px',
            padding: '32px',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            marginBottom: '24px',
            animation: 'fadeInUp 0.6s ease-out 0.3s backwards'
          }}>
            <h3 style={{ 
              fontSize: '1.3rem', 
              fontWeight: '700', 
              marginBottom: '20px', 
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ✅ Your Strengths
            </h3>
            <ul style={{ margin: 0, paddingLeft: '0', color: 'rgba(32, 32, 32, 0.8)', listStyle: 'none' }}>
              {reviewResult.strengths.map((strength, i) => (
                <li key={i} style={{ 
                  marginBottom: '12px', 
                  fontSize: '0.95rem',
                  paddingLeft: '32px',
                  position: 'relative',
                  lineHeight: '1.6'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '0',
                    color: '#16a34a',
                    fontWeight: '600'
                  }}>✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(234, 179, 8, 0.08) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '18px',
            padding: '32px',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            marginBottom: '24px',
            animation: 'fadeInUp 0.6s ease-out 0.4s backwards'
          }}>
            <h3 style={{ 
              fontSize: '1.3rem', 
              fontWeight: '700', 
              marginBottom: '20px', 
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💡 Areas for Improvement
            </h3>
            <ul style={{ margin: 0, paddingLeft: '0', color: 'rgba(32, 32, 32, 0.8)', listStyle: 'none' }}>
              {reviewResult.improvements.map((improvement, i) => (
                <li key={i} style={{ 
                  marginBottom: '12px', 
                  fontSize: '0.95rem',
                  paddingLeft: '32px',
                  position: 'relative',
                  lineHeight: '1.6'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '0',
                    color: '#ea580c',
                    fontWeight: '600'
                  }}>→</span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '18px',
            padding: '32px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            animation: 'fadeInUp 0.6s ease-out 0.5s backwards'
          }}>
            <h3 style={{ 
              fontSize: '1.3rem', 
              fontWeight: '700', 
              marginBottom: '20px', 
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🎯 Recommendations
            </h3>
            <ul style={{ margin: 0, paddingLeft: '0', color: 'rgba(32, 32, 32, 0.8)', listStyle: 'none' }}>
              {reviewResult.recommendations.map((rec, i) => (
                <li key={i} style={{ 
                  marginBottom: '12px', 
                  fontSize: '0.95rem',
                  paddingLeft: '32px',
                  position: 'relative',
                  lineHeight: '1.6'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '0',
                    color: '#2563eb',
                    fontWeight: '600'
                  }}>{i + 1}.</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
