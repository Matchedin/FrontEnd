'use client';

import { ConnectionData } from "@/data/connectionData";

interface StrengthsAndImprovementsProps {
  connectionData?: ConnectionData[];
}

export default function StrengthsAndImprovements({ connectionData }: StrengthsAndImprovementsProps) {
  // Aggregate strengths and improvements from connection data
  const aggregateInsights = (data?: ConnectionData[]) => {
    const strengths: string[] = [];
    const improvements: string[] = [];

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

      // Suggestions for improvement
      if (data.length < 10) {
        improvements.push('Expand your professional network');
      }

      if (industries.length < 3) {
        improvements.push('Connect with professionals in new industries');
      }

      if (roles.length < 3) {
        improvements.push('Explore different career paths');
      }
    }

    // Default insights if no data
    if (strengths.length === 0) {
      strengths.push('Complete your profile to see recommendations');
      strengths.push('Build your professional network');
    }

    if (improvements.length === 0) {
      improvements.push('Upload your resume to get personalized suggestions');
    }

    return { strengths, improvements };
  };

  const { strengths, improvements } = aggregateInsights(connectionData);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '48px',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)',
      animation: 'slideUp 0.6s ease-out 0.2s backwards'
    }}>
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
        💡 Insights & Recommendations
      </h2>
      <p style={{
        fontSize: '1.05rem',
        color: 'rgba(32, 32, 32, 0.7)',
        marginBottom: '32px',
        lineHeight: '1.6'
      }}>
        Based on your resume and network analysis
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
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
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {strengths.map((strength, i) => (
              <li
                key={strength}
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderLeft: '4px solid rgba(34, 197, 94, 0.5)',
                  padding: '16px 20px',
                  marginBottom: '12px',
                  borderRadius: '12px',
                  color: 'rgba(32, 32, 32, 0.85)',
                  lineHeight: '1.6',
                  animation: `slideUp 0.6s ease-out ${0.25 + i * 0.05}s backwards`
                }}
              >
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
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
            🎯 Next Steps
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {improvements.map((improvement, i) => (
              <li
                key={improvement}
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderLeft: '4px solid rgba(59, 130, 246, 0.5)',
                  padding: '16px 20px',
                  marginBottom: '12px',
                  borderRadius: '12px',
                  color: 'rgba(32, 32, 32, 0.85)',
                  lineHeight: '1.6',
                  animation: `slideUp 0.6s ease-out ${0.25 + i * 0.05}s backwards`
                }}
              >
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
