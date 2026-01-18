'use client';

interface PDFViewerProps {
  filePath?: string;
}

export default function PDFViewer({ filePath }: PDFViewerProps) {
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
        📄 Resume Preview
      </div>

      {filePath ? (
        <iframe
          src={`${filePath}#toolbar=0`}
          style={{
            width: '100%',
            height: 'calc(100vh - 400px)',
            borderRadius: '16px',
            border: '1px solid rgba(69, 103, 204, 0.2)',
            backgroundColor: '#fff'
          }}
        />
      ) : (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '16px',
          border: '1px dashed rgba(69, 103, 204, 0.2)',
          color: 'rgba(32, 32, 32, 0.6)',
          fontSize: '0.95rem',
          textAlign: 'center',
          padding: '24px'
        }}>
          Loading resume...
        </div>
      )}
    </div>
  );
}
