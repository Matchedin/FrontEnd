'use client';

interface ConnectionTypesProps {
  connectionTypes: Record<string, number>;
}

export default function ConnectionTypes({ connectionTypes }: ConnectionTypesProps) {
  const sortedTypes = Object.entries(connectionTypes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8); // Top 8 connection types

  const maxCount = Math.max(...Object.values(connectionTypes), 1);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(69, 103, 204, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '48px',
      border: '1px solid rgba(69, 103, 204, 0.2)',
      boxShadow: '0 8px 32px rgba(69, 103, 204, 0.1)',
      animation: 'slideUp 0.6s ease-out'
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
        🌐 Your Network by Type
      </h2>
      <p style={{
        fontSize: '1.05rem',
        color: 'rgba(32, 32, 32, 0.7)',
        marginBottom: '32px',
        lineHeight: '1.6'
      }}>
        Distribution of your connections across different industries and roles
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px'
      }}>
        {sortedTypes.length > 0 ? (
          sortedTypes.map(([type, count], i) => (
            <div
              key={type}
              style={{
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(69, 103, 204, 0.2)',
                transition: 'all 0.3s ease',
                animation: `slideUp 0.6s ease-out ${i * 0.1}s backwards`,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(69, 103, 204, 0.15)';
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
                {type}
              </div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '12px'
              }}>
                {count}
              </div>
              <div style={{
                height: '4px',
                background: 'rgba(69, 103, 204, 0.2)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(count / maxCount) * 100}%`,
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  transition: 'width 0.6s ease-out'
                }} />
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
            No connections found. Build your network first!
          </div>
        )}
      </div>
    </div>
  );
}
