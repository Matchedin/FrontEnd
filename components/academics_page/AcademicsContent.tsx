'use client';

import React, { useState } from 'react';
import ResumeReview from './ResumeReview';
import ClassRecommendations from './ClassRecommendations';
import PDFViewer from './PDFViewer';
import ClassesPanel from './ClassesPanel';

interface ClassRecommendation {
  className: string;
  description: string;
}

export default function AcademicsContent() {
  const [activeTab, setActiveTab] = useState<'resume' | 'classes'>('resume');
  const [classes, setClasses] = useState<ClassRecommendation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pdfPath, setPdfPath] = useState<string>('');

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '32px',
      minHeight: '700px'
    }}>
      {/* Left Side - Forms */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('resume')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'resume' 
                ? 'linear-gradient(135deg, var(--primary) 0%, rgba(69, 103, 204, 0.8) 100%)'
                : 'rgba(255, 255, 255, 0.6)',
              color: activeTab === 'resume' ? 'white' : 'rgba(32, 32, 32, 0.8)',
              border: activeTab === 'resume' 
                ? '1px solid rgba(69, 103, 204, 0.3)'
                : '1px solid rgba(69, 103, 204, 0.15)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontSize: '0.95rem',
              backdropFilter: 'blur(10px)',
              boxShadow: activeTab === 'resume' 
                ? '0 4px 12px rgba(69, 103, 204, 0.2)'
                : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'resume') {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.8)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'resume') {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.6)';
              }
            }}
          >
            📄 Resume Review
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'classes' 
                ? 'linear-gradient(135deg, var(--accent) 0%, rgba(196, 65, 185, 0.8) 100%)'
                : 'rgba(255, 255, 255, 0.6)',
              color: activeTab === 'classes' ? 'white' : 'rgba(32, 32, 32, 0.8)',
              border: activeTab === 'classes' 
                ? '1px solid rgba(196, 65, 185, 0.3)'
                : '1px solid rgba(196, 65, 185, 0.15)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontSize: '0.95rem',
              backdropFilter: 'blur(10px)',
              boxShadow: activeTab === 'classes' 
                ? '0 4px 12px rgba(196, 65, 185, 0.2)'
                : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'classes') {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.8)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'classes') {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.6)';
              }
            }}
          >
            🎓 Class Recommendations
          </button>
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto'
        }}>
          {activeTab === 'resume' && <ResumeReview onPdfPathChange={setPdfPath} />}
          {activeTab === 'classes' && (
            <ClassRecommendations 
              onClassesChange={setClasses}
              onSearchingChange={setIsSearching}
            />
          )}
        </div>
      </div>

      {/* Right Side - PDF/Classes Viewer */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '18px',
        padding: '24px',
        border: '1px solid rgba(69, 103, 204, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        height: 'fit-content',
        position: 'sticky',
        top: '20px',
        marginTop: '65px'
      }}>
        {activeTab === 'resume' && <PDFViewer filePath={pdfPath} />}
        {activeTab === 'classes' && <ClassesPanel classes={classes} isLoading={isSearching} />}
      </div>
    </div>
  );
}
