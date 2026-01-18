'use client';

import React, { useState, useEffect } from 'react';

interface ReviewResult {
  strengths: string[];
  improvements: string[];
  overallScore: number;
  recommendations: string[];
  annotatedPdfUrl?: string;
  metadata?: Record<string, unknown>;
}


  const capitalizeWords = (str?: string) => {
    if (!str) return '';
    // normalize separators, preserve existing ALL-CAPS acronyms
    return str
      .replace(/[_\-]+/g, ' ')
      .split(/\s+/)
      .map(word => {
        if (!word) return '';
        // capture leading/trailing punctuation
        const leading = (word.match(/^[^A-Za-z0-9]+/) || [''])[0];
        const trailing = (word.match(/[^A-Za-z0-9]+$/) || [''])[0];
        const core = word.slice(leading.length, word.length - trailing.length);
        if (core === core.toUpperCase()) return leading + core + trailing; // keep acronyms
        return leading + core.charAt(0).toUpperCase() + core.slice(1).toLowerCase() + trailing;
      })
      .join(' ');
  };

export default function ResumeReview() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState<string>('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Load resume from temp folder on mount
  useEffect(() => {
    const loadResumeFromTemp = async () => {
      try {
        const response = await fetch('/api/get-resume');
        if (!response.ok) {
          throw new Error('Resume file not found in temp folder');
        }
        const blob = await response.blob();
        const filename = response.headers.get('X-Resume-Filename') || 'resume.docx';
        setResumeName(filename);
        setResumeFile(new File([blob], filename, { type: blob.type }));
      } catch (err) {
        setError(`Could not find resume file in temp folder: ${err}`);
        // Silently fail - this is expected when no data has been uploaded
      } finally {
        setIsLoading(false);
      }
    };

    loadResumeFromTemp();
  }, []);

  // Timer for dynamic button text
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReviewing) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReviewing]);

  const getButtonText = () => {
    if (!isReviewing) return 'Get Review';
    
    const messages = [
      'Analyzing Resume...',
      'Extracting Content...',
      'Checking Structure...',
      'Generating Feedback...',
      'Polishing Recommendations...'
    ];
    
    const messageIndex = Math.floor(elapsedTime / 2) % messages.length;
    return messages[messageIndex];
  };


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
              padding: '16px',
              marginBottom: '20px',
              color: '#dc2626',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}>
              <p style={{ fontWeight: '600', marginBottom: '8px', margin: '0 0 8px 0' }}>Error:</p>
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
              setElapsedTime(0);
              setError('');

              try {
                if (!resumeFile) {
                  setError('No resume file selected');
                  setIsReviewing(false);
                  return;
                }

                // Create FormData to send to annotation endpoint
                const formData = new FormData();
                formData.append('file', resumeFile);

                // Call the annotation endpoint
                const response = await fetch('/api/resumeAnnotations', {
                  method: 'POST',
                  body: formData,
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.error || 'Failed to annotate resume');
                }

                // The annotation service now returns JSON with base64 PDF and metadata
                const responseData = await response.json();
                console.log(`[ResumeReview] Received annotation response:`, responseData);
                
                if (!responseData.pdf) {
                  throw new Error('No PDF in response');
                }

                // Convert base64 PDF to blob
                const pdfBinary = atob(responseData.pdf);
                const pdfBytes = new Uint8Array(pdfBinary.length);
                for (let i = 0; i < pdfBinary.length; i++) {
                  pdfBytes[i] = pdfBinary.charCodeAt(i);
                }
                const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
                const pdfUrl = URL.createObjectURL(pdfBlob);

                // Parse annotations from metadata or use mock data
                const metadata = responseData.metadata || {};
                
                const mockReview: ReviewResult = {
                  strengths: metadata.strengths || [
                    'Clear structure and formatting',
                    'Relevant skills highlighted',
                    'Good use of action verbs',
                    'Quantifiable achievements included'
                  ],
                  improvements: metadata.improvements || [
                    'Add more metrics to technical skills',
                    'Include certifications section',
                    'Expand project descriptions',
                    'Add leadership experience examples'
                  ],
                  overallScore: metadata.overall_score || metadata.overallScore || 78,
                  recommendations: metadata.recommendations || [
                    'Consider adding a professional summary',
                    'Tailor resume to specific job descriptions',
                    'Include links to portfolio or GitHub',
                    'Proofread for any typos or inconsistencies'
                  ],
                  annotatedPdfUrl: pdfUrl,
                  metadata: metadata
                };

                setReviewResult(mockReview);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to review resume');
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
            {isLoading ? 'Loading Resume...' : getButtonText()}
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Left Side - Annotations */}
          <div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              {/* Score Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(69, 103, 204, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '18px',
                padding: '20px 24px',
                border: '1px solid rgba(69, 103, 204, 0.3)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                animation: 'fadeInUp 0.6s ease-out 0.1s backwards',
                height: '160px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <p style={{ fontSize: '0.8rem', color: 'rgba(32, 32, 32, 0.6)', margin: '0 0 8px 0', fontWeight: '500' }}>
                  Overall Score
                </p>
                <div style={{
                  fontSize: '2.8rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '4px',
                  lineHeight: '1'
                }}>
                  {reviewResult.overallScore}%
                </div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(32, 32, 32, 0.6)', margin: 0 }}>
                  Good room for improvement
                </p>
              </div>

              {/* File Info Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(69, 103, 204, 0.1) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '18px',
                padding: '20px 24px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                animation: 'fadeInUp 0.6s ease-out 0.2s backwards',
                height: '160px'
              }}>
                <p style={{ fontSize: '0.8rem', color: 'rgba(32, 32, 32, 0.6)', margin: '0 0 8px 0', fontWeight: '500' }}>
                  File Analyzed
                </p>
                <p style={{ fontSize: '0.95rem', color: 'var(--foreground)', margin: 0, fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {resumeFile?.name}
                </p>
              </div>
            </div>

            {/* Annotations Section */}
            {reviewResult.metadata && Array.isArray(reviewResult.metadata.annotations) && (
              <div style={{
                marginTop: '20px',
                animation: 'fadeInUp 0.6s ease-out 0.6s backwards'
              }}>
                <h3 style={{
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                   Annotations ({reviewResult.metadata.annotations.length})
                </h3>
                
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <ol style={{ 
                    margin: 0, 
                    paddingLeft: '20px',
                    listStyle: 'none',
                    maxHeight: '600px',
                    overflowY: 'auto',
                    paddingRight: '12px'
                  }}>
                  {(reviewResult.metadata.annotations as Array<{
                    id: string;
                    phrase: string;
                    kind: string;
                    color: string;
                    comment: string;
                  }>).map((annotation, index) => {
                    return (
                      <li key={annotation.id} style={{
                        marginBottom: '8px',
                        paddingLeft: '24px',
                        position: 'relative',
                        fontSize: '0.85rem',
                        lineHeight: '1.4',
                        color: 'rgba(32, 32, 32, 0.8)'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          fontWeight: '700',
                          color: annotation.color === 'red' ? '#dc2626' : '#d97706',
                          minWidth: '20px'
                        }}>
                          {index + 1}.
                        </span>
                        <span style={{
                          fontWeight: '600',
                          color: annotation.color === 'red' ? '#dc2626' : '#d97706'
                        }}>
                          {capitalizeWords(annotation.phrase)}
                        </span>
                        <span style={{
                          display: 'block',
                          fontSize: '0.8rem',
                          color: 'rgba(32, 32, 32, 0.65)',
                          marginTop: '2px'
                        }}>
                          {annotation.comment}
                        </span>
                      </li>
                    );
                  })}
                </ol>
                </div>
              </div>
            )}
            
            {/* Raw Metadata Section (fallback for non-annotation metadata) */}
            {reviewResult.metadata && Object.keys(reviewResult.metadata).length > 0 && !Array.isArray(reviewResult.metadata.annotations) && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '18px',
                padding: '24px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                marginTop: '24px',
                animation: 'fadeInUp 0.6s ease-out 0.6s backwards'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  marginBottom: '16px',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  📊 Raw Metadata
                </h3>
                <div style={{
                  background: 'rgba(32, 32, 32, 0.05)',
                  borderRadius: '8px',
                  padding: '16px',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  color: 'rgba(32, 32, 32, 0.8)',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {JSON.stringify(reviewResult.metadata, null, 2)}
                </div>
              </div>
            )}
          </div>

          {/* Right Side - PDF Viewer */}
          {reviewResult?.annotatedPdfUrl && (
            <iframe
              src={reviewResult.annotatedPdfUrl}
              style={{
                width: '100%',
                height: '800px',
                border: 'none',
                borderRadius: '12px',
                position: 'sticky',
                top: '100px'
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
