'use client';

interface PortfolioHeaderProps {
  userInfo: { name: string; school: string } | null;
}

export default function PortfolioHeader({ userInfo }: PortfolioHeaderProps) {
  return (
    <div style={{ marginBottom: '50px', textAlign: 'center' }}>
      <div style={{
        display: 'inline-block',
        background: 'linear-gradient(135deg, rgba(69, 103, 204, 0.1) 0%, rgba(196, 65, 185, 0.1) 100%)',
        border: '1px solid rgba(69, 103, 204, 0.2)',
        borderRadius: '50px',
        padding: '8px 16px',
        marginBottom: '16px',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: 'var(--primary)',
        backdropFilter: 'blur(10px)'
      }}>
        ⭐ My Portfolio
      </div>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        margin: '0 0 16px 0',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: '1.2'
      }}>
        {userInfo?.name || 'Your Professional Portfolio'}
      </h1>
      <p style={{
        fontSize: '1.15rem',
        color: 'rgba(32, 32, 32, 0.7)',
        margin: 0,
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto',
        lineHeight: '1.6'
      }}>
        {userInfo?.school && `From ${userInfo.school} • `}
        A comprehensive view of your network, strengths, and professional profile
      </p>
    </div>
  );
}
