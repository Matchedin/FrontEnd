'use client';

interface AcademicsTabsProps {
  activeTab: 'resume' | 'classes';
  onTabChange: (tab: 'resume' | 'classes') => void;
}

export default function AcademicsTabs({ activeTab, onTabChange }: AcademicsTabsProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      marginBottom: '40px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }}>
      <button
        onClick={() => onTabChange('resume')}
        style={{
          padding: '14px 32px',
          background: activeTab === 'resume' 
            ? 'linear-gradient(135deg, var(--primary) 0%, rgba(69, 103, 204, 0.8) 100%)'
            : 'rgba(255, 255, 255, 0.6)',
          color: activeTab === 'resume' ? 'white' : 'rgba(32, 32, 32, 0.8)',
          border: activeTab === 'resume' 
            ? '1px solid rgba(69, 103, 204, 0.3)'
            : '1px solid rgba(69, 103, 204, 0.15)',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: '600',
          transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          fontSize: '1rem',
          backdropFilter: 'blur(10px)',
          boxShadow: activeTab === 'resume' 
            ? '0 8px 24px rgba(69, 103, 204, 0.2)'
            : 'none',
          transform: activeTab === 'resume' ? 'translateY(-2px)' : 'translateY(0)'
        }}
        onMouseEnter={(e) => {
          if (activeTab !== 'resume') {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.8)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (activeTab !== 'resume') {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.6)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }
        }}
      >
        📄 Resume Review
      </button>
      <button
        onClick={() => onTabChange('classes')}
        style={{
          padding: '14px 32px',
          background: activeTab === 'classes' 
            ? 'linear-gradient(135deg, var(--accent) 0%, rgba(196, 65, 185, 0.8) 100%)'
            : 'rgba(255, 255, 255, 0.6)',
          color: activeTab === 'classes' ? 'white' : 'rgba(32, 32, 32, 0.8)',
          border: activeTab === 'classes' 
            ? '1px solid rgba(196, 65, 185, 0.3)'
            : '1px solid rgba(196, 65, 185, 0.15)',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: '600',
          transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          fontSize: '1rem',
          backdropFilter: 'blur(10px)',
          boxShadow: activeTab === 'classes' 
            ? '0 8px 24px rgba(196, 65, 185, 0.2)'
            : 'none',
          transform: activeTab === 'classes' ? 'translateY(-2px)' : 'translateY(0)'
        }}
        onMouseEnter={(e) => {
          if (activeTab !== 'classes') {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.8)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (activeTab !== 'classes') {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.6)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }
        }}
      >
        🎓 Class Recommendations
      </button>
    </div>
  );
}
