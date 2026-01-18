'use client';

interface ClassesPanelProps {
  classes: Array<{ className: string; description: string }>;
  isLoading: boolean;
}

export default function ClassesPanel({ classes, isLoading }: ClassesPanelProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      height: '100%'
    }}>
      <div style={{
        fontSize: '1rem',
        fontWeight: '700',
        color: 'var(--foreground)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        ✨ Recommended Classes
      </div>

      {isLoading ? (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '16px',
          border: '1px dashed rgba(196, 65, 185, 0.2)',
          color: 'rgba(32, 32, 32, 0.6)',
          fontSize: '0.95rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔍</div>
            Searching for classes...
          </div>
        </div>
      ) : classes.length > 0 ? (
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxHeight: '500px',
          paddingRight: '4px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        className="hide-scrollbar">
          {classes.map((classItem, i) => (
            <div
              key={i}
              style={{
                background: 'linear-gradient(135deg, rgba(196, 65, 185, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(196, 65, 185, 0.2)',
                transition: 'all 0.3s ease',
                animation: `slideUp 0.6s ease-out ${i * 0.05}s backwards`,
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(196, 65, 185, 0.15)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(196, 65, 185, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(196, 65, 185, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)';
              }}
            >
              <h4 style={{
                fontSize: '0.95rem',
                fontWeight: '700',
                marginBottom: '6px',
                color: 'var(--accent)',
                margin: 0
              }}>
                {classItem.className}
              </h4>
              <p style={{
                fontSize: '0.85rem',
                color: 'rgba(32, 32, 32, 0.7)',
                lineHeight: '1.5',
                margin: 0
              }}>
                {classItem.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '16px',
          border: '1px dashed rgba(196, 65, 185, 0.2)',
          color: 'rgba(32, 32, 32, 0.6)',
          fontSize: '0.95rem',
          textAlign: 'center',
          padding: '24px'
        }}>
          No classes found. Try searching with your skills.
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
