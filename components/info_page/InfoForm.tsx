'use client';

import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

interface InfoFormProps {
  onConnectionsDataReady?: (data: string, resumeFile?: File) => void;
}

export default function InfoForm({ onConnectionsDataReady }: InfoFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    resume: null as File | null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingStep, setLoadingStep] = useState<'processing' | 'analyzing' | 'finalizing' | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          file.type === 'application/msword') {
        setFormData(prev => ({
          ...prev,
          resume: file
        }));
        setError('');
      } else {
        setError('Please upload a valid DOCX file');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!formData.school.trim()) {
      setError('Please enter your school');
      return;
    }
    
    if (!formData.resume) {
      setError('Please upload your resume');
      return;
    }

    setIsLoading(true);
    setLoadingStep('processing');
    
    try {
      // Step 1: Clear temp folder
      console.log('Clearing temp folder...');
      try {
        const clearResp = await fetch('/api/temp-management?action=clear', {
          method: 'POST',
        });
        if (!clearResp.ok) {
          const errText = await clearResp.text();
          console.error('Temp clear failed:', errText);
        } else {
          console.log('Temp clear response:', await clearResp.clone().json());
        }
      } catch (err) {
        console.error('Temp clear fetch error:', err);
      }

      // Step 2: Upload resume and get matches
      console.log('Uploading resume and fetching matches...');
      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.resume);

      const response = await fetch('/api/connection_fetching', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process resume');
      }

      const result = await response.json();
      
      // Step 3: Save uploaded resume file to temp
      console.log('Saving resume file to temp...');
      const resumeFormData = new FormData();
      resumeFormData.append('file', formData.resume);
      resumeFormData.append('filename', formData.resume.name);
      
      await fetch('/api/temp-management?action=save-file', {
        method: 'POST',
        body: resumeFormData,
      });

      // Step 4: Save matches JSON to temp
      console.log('Saving matches to temp...');
      await fetch('/api/temp-management?action=save-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: result,
          filename: 'matches.json'
        }),
      });

      // Step 5: Flatten the API response if it has nested structure
      let flattenedData: Array<Record<string, unknown>> = [];
      if (result.top_25_people && result.last_50_people) {
        // API returned nested structure - flatten it
        flattenedData = [...(result.top_25_people as Array<Record<string, unknown>>), ...(result.last_50_people as Array<Record<string, unknown>>)];
      } else if (Array.isArray(result)) {
        // API returned flat array
        flattenedData = result as Array<Record<string, unknown>>;
      } else {
        // Fallback - try to extract as array
        flattenedData = Object.values(result).flat() as Array<Record<string, unknown>>;
      }

      // Step 6: Store in sessionStorage
      console.log('Storing connections data...');
      sessionStorage.setItem('connectionsData', JSON.stringify(flattenedData));
      sessionStorage.setItem('userInfo', JSON.stringify({
        name: formData.name,
        school: formData.school
      }));

      // Change loading step to analyzing
      setLoadingStep('analyzing');
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Change loading step to finalizing
      setLoadingStep('finalizing');
      await new Promise(resolve => setTimeout(resolve, 5000));

      setError('');
      
      // Redirect to portfolio page with a small delay to let other components initialize
      if (onConnectionsDataReady) {
        onConnectionsDataReady(JSON.stringify(flattenedData), formData.resume || undefined);
      }
      
      setFormData({ name: '', school: '', resume: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during upload';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
      setLoadingStep(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Tell Us About Yourself
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(32, 32, 32, 0.7)' }}>
          Upload your resume and we will build your network profile
        </p>
        {error && (
          <div style={{ 
            marginTop: '12px', 
            padding: '12px', 
            borderRadius: '8px', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#dc2626',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Name Input */}
      <div style={{paddingBottom: '10px'}}>
        <Input
          type="text"
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: (e.target as HTMLInputElement).value }))}
          variant="outlined"
          required
        />
      </div>

      {/* School Input */}
      <div>
        <Input
          type="text"
          label="School/University"
          value={formData.school}
          onChange={(e) => setFormData(prev => ({ ...prev, school: (e.target as HTMLInputElement).value }))}
          variant="outlined"
          required
        />
      </div>

      {/* Resume Upload */}
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--primary)', fontSize: '0.95rem' }}>
          Upload Resume (DOCX) *
        </label>
        <div
          style={{
            border: '2px solid rgba(69, 103, 204, 0.3)',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            backgroundColor: formData.resume ? 'rgba(69, 103, 204, 0.15)' : 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(10px)',
            background: formData.resume 
              ? 'linear-gradient(135deg, rgba(69, 103, 204, 0.15) 0%, rgba(196, 65, 185, 0.1) 100%)'
              : 'rgba(255, 255, 255, 0.4)',
            boxShadow: 'inset 0 0 20px rgba(69, 103, 204, 0.05)'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(69, 103, 204, 0.6)';
            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(69, 103, 204, 0.2) 0%, rgba(196, 65, 185, 0.15) 100%)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(69, 103, 204, 0.3)';
            (e.currentTarget as HTMLElement).style.background = formData.resume 
              ? 'linear-gradient(135deg, rgba(69, 103, 204, 0.15) 0%, rgba(196, 65, 185, 0.1) 100%)'
              : 'rgba(255, 255, 255, 0.4)';
          }}
        >
          <input
            type="file"
            accept=".docx,.doc"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="resume-upload"
          />
          <label
            htmlFor="resume-upload"
            style={{
              cursor: 'pointer',
              display: 'block'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📄</div>
            <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--primary)', marginBottom: '4px' }}>
              {formData.resume ? formData.resume.name : 'Click to upload or drag and drop'}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(32, 32, 32, 0.6)' }}>
              DOCX files only
            </div>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        variant="solid"
        colorScheme="primary"
        size="lg"
        onClick={() => {
          const formElement = document.querySelector('form');
          if (formElement) {
            formElement.dispatchEvent(new Event('submit', { bubbles: true }));
          }
        }}
        loading={isLoading}
        customStyles={{ width: '100%', marginTop: '16px' }}
      >
        {!isLoading && 'Build My Network'}
        {isLoading && loadingStep === 'processing' && 'Processing Your Resume...'}
        {isLoading && loadingStep === 'analyzing' && 'Analyzing Your Skills...'}
        {isLoading && loadingStep === 'finalizing' && 'Preparing Your Profile...'}
      </Button>

      <p style={{ fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center' }}>
        Your information is secure and will be used only to create your network profile
      </p>
    </form>
  );
}
