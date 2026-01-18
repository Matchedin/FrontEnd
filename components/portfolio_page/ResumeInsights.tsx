'use client';

import { ConnectionData } from "@/data/connectionData";

interface ResumeInsightsProps {
  resumeText: string;
  connectionData?: ConnectionData[];
}

export default function ResumeInsights({ resumeText, connectionData }: ResumeInsightsProps) {
  // Extract characteristics from resume
  const extractCharacteristics = (text: string) => {
    const chars: { label: string; value: string }[] = [];

    // Enhanced degree detection with year and status
    const detectDegree = (text: string) => {
      const currentYear = new Date().getFullYear();

      // First, try to find full degree lines with field of study
      const fullDegreePatterns = [
        /(?:Bachelor|Master|Doctor|Associate)(?:\s+of\s+(?:Science|Arts|Business|Engineering|Medicine|Law|etc\.?))?(?:\s+in\s+[\w\s,&]+?)?(?:\s*\([^)]*\))?\s*(?:\d{4}|May\s+\d{4}|Expected\s+\d{4})/i,
        /(?:B\.?S\.?|M\.?S\.?|Ph\.?D\.?|B\.?A\.?|M\.?A\.?|M\.?B\.?A\.?)(?:\s+in\s+[\w\s,&]+?)?(?:\s*\([^)]*\))?\s*(?:\d{4}|May\s+\d{4}|Expected\s+\d{4})/i
      ];

      for (const pattern of fullDegreePatterns) {
        const match = text.match(pattern);
        if (match) {
          const fullDegreeText = match[0].trim();

          // Extract year from the degree text
          const yearMatch = fullDegreeText.match(/\b(20\d{2}|19\d{2})\b/);
          if (yearMatch) {
            const degreeYear = parseInt(yearMatch[0]);

            // Determine status
            let status = '';
            if (degreeYear > currentYear) {
              status = 'Expected';
            } else if (degreeYear === currentYear) {
              status = 'In Progress';
            } else {
              status = 'Completed';
            }

            // Clean up the degree name (remove year, month, and extra spaces)
            let degreeName = fullDegreeText
              .replace(/\s*\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b\s*/i, '')
              .replace(/\s*\b(?:Expected|Exp\.?)\s+\d{4}\b\s*/i, '')
              .replace(/\s*\b(20\d{2}|19\d{2})\b\s*/, '')
              .trim();

            // Format common abbreviations nicely
            degreeName = degreeName
              .replace(/\bB\.?S\.?\b/i, 'Bachelor of Science')
              .replace(/\bM\.?S\.?\b/i, 'Master of Science')
              .replace(/\bPh\.?D\.?\b/i, 'Ph.D.')
              .replace(/\bB\.?A\.?\b/i, 'Bachelor of Arts')
              .replace(/\bM\.?A\.?\b/i, 'Master of Arts')
              .replace(/\bM\.?B\.?A\.?\b/i, 'Master of Business Administration');

            return {
              degree: degreeName,
              year: degreeYear,
              status: status
            };
          }
        }
      }

      // Fallback: look for degree patterns without full context
      const degreePatterns = [
        /(?:B\.?S\.?|B\.?A\.?|Bachelor(?:'s)?(?:\s+of\s+(?:Science|Arts|Business|Engineering|etc\.?))?)/i,
        /(?:M\.?S\.?|M\.?A\.?|M\.?B\.?A\.?|Master(?:'s)?(?:\s+of\s+(?:Science|Arts|Business|etc\.?))?)/i,
        /(?:Ph\.?D\.?|Doctorate|Doctor(?:\s+of\s+Philosophy)?)/i,
        /(?:Associate(?:'s)?(?:\s+Degree)?)/i
      ];

      for (const pattern of degreePatterns) {
        const degreeMatch = text.match(pattern);
        if (degreeMatch) {
          const degreeText = degreeMatch[0];

          // Look for year patterns around the degree (within ~50 characters)
          const degreeIndex = degreeMatch.index!;
          const contextStart = Math.max(0, degreeIndex - 50);
          const contextEnd = Math.min(text.length, degreeIndex + degreeText.length + 50);
          const context = text.substring(contextStart, contextEnd);

          // Look for years in the context
          const yearMatches = context.match(/\b(20\d{2}|19\d{2})\b/g);
          if (yearMatches) {
            // Find the most relevant year (closest to the degree)
            const years = yearMatches.map(y => parseInt(y)).sort((a, b) => b - a); // Sort descending
            const degreeYear = years[0];

            // Determine status
            let status = '';
            if (degreeYear > currentYear) {
              status = 'Expected';
            } else if (degreeYear === currentYear) {
              status = 'In Progress';
            } else {
              status = 'Completed';
            }

            // Format degree name
            let degreeName = degreeText;
            if (degreeText.toLowerCase().includes('b.s') || degreeText.toLowerCase().includes('b.a') || degreeText.toLowerCase().includes('bachelor')) {
              degreeName = 'Bachelor\'s Degree';
            } else if (degreeText.toLowerCase().includes('m.s') || degreeText.toLowerCase().includes('m.a') || degreeText.toLowerCase().includes('master')) {
              degreeName = 'Master\'s Degree';
            } else if (degreeText.toLowerCase().includes('ph.d') || degreeText.toLowerCase().includes('doctorate')) {
              degreeName = 'Ph.D.';
            } else if (degreeText.toLowerCase().includes('associate')) {
              degreeName = 'Associate Degree';
            }

            return {
              degree: degreeName,
              year: degreeYear,
              status: status
            };
          }

          // No year found, just return the degree
          return {
            degree: degreeText,
            year: null,
            status: 'Completed'
          };
        }
      }

      return null;
    };

    const degreeInfo = detectDegree(text);
    if (degreeInfo) {
      let value = degreeInfo.degree;
      if (degreeInfo.year) {
        if (degreeInfo.status === 'In Progress') {
          value += ` (In Progress - ${degreeInfo.year})`;
        } else if (degreeInfo.status === 'Expected') {
          value += ` (Expected ${degreeInfo.year})`;
        } else {
          value += ` (${degreeInfo.year})`;
        }
      }
      chars.push({ label: 'Highest Degree', value });
    }

    // Count years of experience (rough estimate)
    const yearMatches = text.match(/\b(20\d{2}|19\d{2})\b/g);
    if (yearMatches && yearMatches.length >= 2) {
      const years = Math.abs(parseInt(yearMatches[yearMatches.length - 1]) - parseInt(yearMatches[0]));
      if (years > 0) {
        chars.push({ label: 'Years of Experience', value: `${years}+` });
      }
    }

    // Count skills (common programming/tech skills)
    const commonSkills = ['Python', 'JavaScript', 'React', 'SQL', 'Java', 'C++', 'AWS', 'Docker', 'Git'];
    const foundSkills = commonSkills.filter(skill => text.includes(skill));
    if (foundSkills.length > 0) {
      chars.push({ label: 'Key Technologies', value: foundSkills.slice(0, 3).join(', ') });
    }

    return chars;
  };

  // Aggregate strengths from connection data
  const aggregateStrengths = (data?: ConnectionData[]) => {
    const strengths: string[] = [];

    if (data && data.length > 0) {
      // Aggregate based on connection patterns
      const roles = data.map((d) => d.current_role).filter(Boolean);
      const industries = data.map((d) => d.industry).filter(Boolean);

      if (industries.length > 0) {
        strengths.push(`Strong presence in ${industries[0]} industry`);
      }

      if (roles.length > 0) {
        strengths.push(`Well-positioned for ${roles[0]} roles`);
      }

      if (data.length > 10) {
        strengths.push('Extensive professional network');
      }

      if (data.length > 5 && industries.length > 3) {
        strengths.push('Cross-industry experience');
      }
    }

    // Default insights if no data
    if (strengths.length === 0) {
      strengths.push('Complete your profile to see recommendations');
      strengths.push('Build your professional network');
    }

    return strengths;
  };

  const characteristics = extractCharacteristics(resumeText);
  const strengths = aggregateStrengths(connectionData);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(196, 65, 185, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '48px',
      border: '1px solid rgba(196, 65, 185, 0.2)',
      boxShadow: '0 8px 32px rgba(196, 65, 185, 0.1)',
      animation: 'slideUp 0.6s ease-out 0.1s backwards'
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
        Resume Insights
      </h2>
      <p style={{
        fontSize: '1.05rem',
        color: 'rgba(32, 32, 32, 0.7)',
        marginBottom: '32px',
        lineHeight: '1.6'
      }}>
        Key attributes and strengths from your resume and network
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Resume Characteristics */}
        <div>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: '600',
            marginBottom: '20px',
            color: 'var(--foreground)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Characteristics
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '12px'
          }}>
            {characteristics.length > 0 ? (
              characteristics.map((char, i) => (
                <div
                  key={char.label}
                  style={{
                    background: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(196, 65, 185, 0.2)',
                    transition: 'all 0.3s ease',
                    animation: `slideUp 0.6s ease-out ${i * 0.1}s backwards`
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 16px rgba(196, 65, 185, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(32, 32, 32, 0.7)',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}>
                    {char.label}
                  </div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: 'var(--accent)'
                  }}>
                    {char.value}
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '20px',
                color: 'rgba(32, 32, 32, 0.6)',
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '12px'
              }}>
                Upload your resume to extract characteristics
              </div>
            )}
          </div>
        </div>

        {/* Strengths */}
        <div>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: '600',
            marginBottom: '20px',
            color: 'var(--foreground)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
              Strengths
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '12px'
          }}>
            {strengths.map((strength, i) => (
              <div
                key={strength}
                style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  transition: 'all 0.3s ease',
                  animation: `slideUp 0.6s ease-out ${0.25 + i * 0.05}s backwards`
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 16px rgba(34, 197, 94, 0.15)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div style={{
                  fontSize: '1rem',
                  color: 'rgba(32, 32, 32, 0.85)',
                  lineHeight: '1.6',
                  fontWeight: '500'
                }}>
                  {strength}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}