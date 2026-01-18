'use client';

import React, { useState, useEffect } from 'react';

interface Person {
  name: string;
  email: string;
  location: string;
  headline: string;
  about: string;
  current_role: string;
  current_company: string;
  can_offer: string[];
  industry: string;
  skills: string[];
  needs: string[];
  rank?: number;
}

interface ConnectModalProps {
  person: Person | null;
  isOpen: boolean;
  onClose: () => void;
  resumeFile?: File | null;
}

export default function ConnectModal({ person, isOpen, onClose, resumeFile }: ConnectModalProps) {
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [resumeText, setResumeText] = useState<string>('');

  // Remove automatic email generation - let user click button instead
  useEffect(() => {
    // Clear email when modal opens so it doesn't show stale data
    if (isOpen) {
      setGeneratedEmail('');
      setError('');
    }
  }, [isOpen]);

  const generateEmail = async () => {
    if (!person) {
      setError('Missing person data');
      return;
    }

    let textToUse = resumeText;
    
    // If no resume text cached, fetch it from API
    if (!textToUse) {
      try {
        const response = await fetch('/api/get-resume-text');
        if (!response.ok) {
          throw new Error('Resume file not found in temp folder');
        }
        const data = await response.json();
        textToUse = data.text;
        setResumeText(textToUse); // Cache it for next time
      } catch (err) {
        setError(`Could not find resume file. Please ensure a .docx file exists in the temp folder: ${err}`);
        return;
      }
    }

    setIsGenerating(true);
    setError('');
    setGeneratedEmail('');

    try {
      const payload = {
        profileJson: JSON.stringify(person),
        resumeText: textToUse
      };

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate email');
      }

      const emailText = await response.text();
      setGeneratedEmail(emailText);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Email generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !person) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          padding: '32px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          border: '1px solid rgba(69, 103, 204, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--foreground)' }}>
              {person.name}
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(32, 32, 32, 0.7)', margin: 0 }}>
              {person.current_role} at {person.current_company}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#999',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Person Info */}
        <div
          style={{
            background: 'rgba(69, 103, 204, 0.05)',
            border: '1px solid rgba(69, 103, 204, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px'
          }}
        >
          <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: 'rgba(32, 32, 32, 0.6)' }}>
            <strong>Email:</strong>
          </p>
          <p
            style={{
              margin: '0 0 12px 0',
              fontSize: '1rem',
              color: 'var(--primary)',
              wordBreak: 'break-all'
            }}
          >
            {person.email}
          </p>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: 'rgba(32, 32, 32, 0.6)' }}>
            <strong>Location:</strong> {person.location}
          </p>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem', color: 'rgba(32, 32, 32, 0.6)' }}>
            <strong>Headline:</strong> {person.headline}
          </p>
        </div>

        {/* Email Generation Section */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px', color: 'var(--primary)' }}>
            Cold Email
          </h3>

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px',
                color: '#dc2626',
                fontSize: '0.875rem'
              }}
            >
              {error}
            </div>
          )}

          {!generatedEmail && !isGenerating && (
            <button
              onClick={generateEmail}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '12px'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 16px rgba(69, 103, 204, 0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              Generate Cold Email
            </button>
          )}

          {isGenerating && (
            <div
              style={{
                background: 'rgba(69, 103, 204, 0.05)',
                border: '1px solid rgba(69, 103, 204, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.875rem', color: 'rgba(32, 32, 32, 0.6)', marginBottom: '8px' }}>
                Generating personalized email...
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
                      opacity: 0.6
                    }}
                  />
                ))}
              </div>
              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 0.6; transform: scale(1); }
                  50% { opacity: 1; transform: scale(1.2); }
                }
              `}</style>
            </div>
          )}

          {generatedEmail && (
            <>
              <div
                style={{
                  background: '#f9fafb',
                  border: '1px solid rgba(69, 103, 204, 0.2)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  color: 'var(--foreground)'
                }}
              >
                {generatedEmail}
              </div>

              <button
                onClick={copyToClipboard}
                style={{
                  background: copied
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  if (!copied) (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  if (!copied) (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {copied ? '✓ Copied to Clipboard' : 'Copy Email'}
              </button>
            </>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            background: 'rgba(69, 103, 204, 0.1)',
            color: 'var(--primary)',
            border: '1px solid rgba(69, 103, 204, 0.2)',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(69, 103, 204, 0.2)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(69, 103, 204, 0.1)';
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
