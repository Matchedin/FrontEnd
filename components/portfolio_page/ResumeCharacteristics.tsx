'use client';

interface ResumeCharacteristicsProps {
  resumeText: string;
}

export default function ResumeCharacteristics({ resumeText }: ResumeCharacteristicsProps) {
  // Extract characteristics from resume
  const extractCharacteristics = (text: string) => {
    const chars: { label: string; value: string }[] = [];

    // Extract education (look for degree patterns)
    const degreeMatch = text.match(/(?:B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?A\.?|Ph\.?D\.?|Associate|Bachelor|Master|Doctorate)/i);
    if (degreeMatch) {
      chars.push({ label: 'Highest Degree', value: degreeMatch[0] });
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

  const characteristics = extractCharacteristics(resumeText);

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
        📊 Resume Characteristics
      </h2>
      <p style={{
        fontSize: '1.05rem',
        color: 'rgba(32, 32, 32, 0.7)',
        marginBottom: '32px',
        lineHeight: '1.6'
      }}>
        Key attributes extracted from your resume
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {characteristics.length > 0 ? (
          characteristics.map((char, i) => (
            <div
              key={char.label}
              style={{
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(196, 65, 185, 0.2)',
                transition: 'all 0.3s ease',
                animation: `slideUp 0.6s ease-out ${i * 0.1}s backwards`
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(196, 65, 185, 0.15)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '0.9rem',
                color: 'rgba(32, 32, 32, 0.7)',
                marginBottom: '12px',
                fontWeight: '500'
              }}>
                {char.label}
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--accent)'
              }}>
                {char.value}
              </div>
            </div>
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px',
            color: 'rgba(32, 32, 32, 0.6)'
          }}>
            Upload your resume to extract characteristics
          </div>
        )}
      </div>
    </div>
  );
}
