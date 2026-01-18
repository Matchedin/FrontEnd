'use client';

import React, { useState, useEffect } from 'react';

interface ClassRecommendation {
  className: string;
  description: string;
}

interface ClassRecommendationsProps {
  onClassesChange?: (classes: ClassRecommendation[]) => void;
  onSearchingChange?: (isSearching: boolean) => void;
}

export default function ClassRecommendations({ onClassesChange, onSearchingChange }: ClassRecommendationsProps) {
  const [university, setUniversity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<ClassRecommendation[]>([]);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Load resume from temp folder on mount
  useEffect(() => {
    const loadResumeFromTemp = async () => {
      try {
        const response = await fetch('/api/get-resume-text');
        if (!response.ok) {
          throw new Error('Resume file not found in temp folder');
        }
        const data = await response.json();
        
        // Extract skills from resume text (basic extraction - can be improved)
        const skills = extractSkillsFromResume(data.text);
        setExtractedSkills(skills);
      } catch (err) {
        setError('Could not load resume from temp folder');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadResumeFromTemp();
  }, []);

  // Basic skill extraction from resume text
  const extractSkillsFromResume = (text: string): string[] => {
    // Common skills to look for in resume
    const commonSkills = [
      'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'React', 'Vue', 'Angular',
      'Node.js', 'Express', 'Django', 'Flask', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure', 'GCP',
      'Machine Learning', 'Deep Learning', 'Data Science', 'Data Analysis', 'Statistics',
      'Web Development', 'Full Stack', 'Frontend', 'Backend', 'DevOps', 'Docker', 'Kubernetes',
      'Leadership', 'Communication', 'Project Management', 'Agile', 'Scrum',
      'UI/UX', 'Design', 'Figma', 'Adobe', 'Git', 'Linux', 'API', 'REST'
    ];

    const found: string[] = [];
    const lowerText = text.toLowerCase();
    
    commonSkills.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase()) && !found.includes(skill)) {
        found.push(skill);
      }
    });

    return found.slice(0, 10); // Return top 10 skills
  };

  const handleSearch = async () => {
    if (!university.trim()) {
      setError('Please enter a university');
      return;
    }

    if (extractedSkills.length === 0) {
      setError('No skills found in resume');
      return;
    }

    setIsSearching(true);
    onSearchingChange?.(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await fetch('/api/lookup-skill-classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          university,
          skills: extractedSkills
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Response status:', response.status);
        console.error('Response text:', errorData);
        throw new Error(`Failed to get recommendations: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log(`[ClassRecommendations] Received ${data.classes?.length || 0} classes:`, data.classes);
      setRecommendations(data.classes || []);
      onClassesChange?.(data.classes || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to get recommendations';
      setError(errorMsg);
      setRecommendations([]);
      onClassesChange?.([]);
      console.error('Full error:', err);
    } finally {
      setIsSearching(false);
      onSearchingChange?.(false);
    }
  };

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, rgba(196, 65, 185, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '48px',
        border: '1px solid rgba(196, 65, 185, 0.3)',
        boxShadow: '0 20px 60px rgba(196, 65, 185, 0.1)',
        marginBottom: '32px',
        animation: 'slideUp 0.6s ease-out'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '12px',
          color: 'var(--foreground)',
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Find Classes to Develop Your Skills
        </h2>
        <p style={{
          fontSize: '1.05rem',
          color: 'rgba(32, 32, 32, 0.7)',
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          We&apos;ve extracted skills from your resume. Enter your university and we&apos;ll recommend classes to fill gaps in your skill set.
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '24px',
            color: '#dc2626',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            ⚠️ {error}
          </div>
        )}

        {isLoading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 40px',
            color: 'rgba(32, 32, 32, 0.6)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '500' }}>Loading resume and extracting skills...</p>
          </div>
        ) : (
          <>
            {/* Skills Display */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '700',
                marginBottom: '16px',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📊 Skills Extracted from Your Resume
              </h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {extractedSkills.length > 0 ? (
                  extractedSkills.map((skill, i) => (
                    <span key={i} style={{
                      fontSize: '0.9rem',
                      background: 'linear-gradient(135deg, rgba(196, 65, 185, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
                      border: '1px solid rgba(196, 65, 185, 0.4)',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      color: 'var(--accent)',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      animation: `fadeIn 0.4s ease-out ${i * 0.05}s backwards`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(196, 65, 185, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(196, 65, 185, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)';
                    }}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ color: 'rgba(32, 32, 32, 0.6)', fontSize: '0.95rem' }}>
                    No skills found in resume. Try uploading a resume with skill information.
                  </span>
                )}
              </div>
            </div>

            {/* University Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '700',
                marginBottom: '12px',
                color: 'var(--accent)'
              }}>
                University / School
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g., MIT, Stanford, UC Berkeley"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1px solid rgba(196, 65, 185, 0.3)',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                  background: 'rgba(255, 255, 255, 0.5)',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(196, 65, 185, 0.6)';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(196, 65, 185, 0.15)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(196, 65, 185, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                }}
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={isSearching || extractedSkills.length === 0}
              style={{
                width: '100%',
                padding: '16px',
                background: extractedSkills.length > 0 && !isSearching
                  ? 'linear-gradient(135deg, var(--accent) 0%, rgba(196, 65, 185, 0.8) 100%)'
                  : 'rgba(196, 65, 185, 0.3)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: extractedSkills.length > 0 && !isSearching ? 'pointer' : 'not-allowed',
                fontWeight: '700',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                opacity: isSearching ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (extractedSkills.length > 0 && !isSearching) {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(196, 65, 185, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (extractedSkills.length > 0 && !isSearching) {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }
              }}
            >
              {isSearching ? ' Finding Classes...' : ' Get Recommendations'}
            </button>
          </>
        )}
      </div>

      {/* Results */}
      {hasSearched && recommendations.length > 0 && (
        <div style={{ animation: 'fadeIn 0.4s ease-out', marginTop: '32px', width: '100%', boxSizing: 'border-box' }}>
          <h3 style={{
            fontSize: '1.6rem',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: 'var(--foreground)',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Recommended Classes
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', minHeight: '600px', alignItems: 'start', width: '100%' }}>
            {/* Top recommendation on the left - takes full height */}
            {recommendations.length > 0 && (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(196, 65, 185, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '32px',
                  border: '1px solid rgba(196, 65, 185, 0.4)',
                  transition: 'all 0.3s ease',
                  animation: 'slideUp 0.6s ease-out 0s backwards',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(196, 65, 185, 0.3)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(196, 65, 185, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(196, 65, 185, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.5rem' }}>⭐</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase' }}>Top Recommendation</span>
                </div>
                <h4 style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  marginBottom: '16px',
                  color: 'var(--accent)',
                  margin: '0 0 16px 0'
                }}>
                  {recommendations[0].className}
                </h4>
                <p style={{
                  fontSize: '1rem',
                  color: 'rgba(32, 32, 32, 0.8)',
                  lineHeight: '1.7',
                  margin: 0
                }}>
                  {recommendations[0].description}
                </p>
              </div>
            )}

            {/* Other recommendations on the right - scrollable */}
            {recommendations.length > 1 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                maxHeight: '600px',
                overflowY: 'auto',
                paddingRight: '12px'
              }}>
                {recommendations.slice(1).map((classItem, i) => (
                  <div
                    key={i + 1}
                    style={{
                      background: 'linear-gradient(135deg, rgba(196, 65, 185, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(196, 65, 185, 0.2)',
                      transition: 'all 0.3s ease',
                      animation: `slideUp 0.6s ease-out ${(i + 1) * 0.1}s backwards`,
                      flex: '0 0 auto'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(196, 65, 185, 0.2)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                      (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(196, 65, 185, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(196, 65, 185, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)';
                    }}
                  >
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      marginBottom: '8px',
                      color: 'var(--accent)',
                      margin: '0 0 8px 0'
                    }}>
                      {classItem.className}
                    </h4>
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {hasSearched && recommendations.length === 0 && !isLoading && !isSearching && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(196, 65, 185, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '18px',
          padding: '48px',
          textAlign: 'center',
          border: '1px solid rgba(196, 65, 185, 0.2)',
          animation: 'fadeIn 0.4s ease-out',
          marginTop: '32px'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}></div>
          <p style={{ fontSize: '1rem', color: 'rgba(32, 32, 32, 0.7)', margin: 0, fontWeight: '500' }}>
            No classes found for the selected criteria. Try adjusting your skills or university.
          </p>
        </div>
      )}
    </div>
  );
}
