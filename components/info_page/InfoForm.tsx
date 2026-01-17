'use client';

import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

export default function InfoForm() {
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    resume: null as File | null
  });
  const [isLoading, setIsLoading] = useState(false);

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
      } else {
        alert('Please upload a valid DOCX file');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!formData.school.trim()) {
      alert('Please enter your school');
      return;
    }
    
    if (!formData.resume) {
      alert('Please upload your resume');
      return;
    }

    setIsLoading(true);
    
    // TODO: Send to backend for processing
    console.log('Form submitted:', formData);
    
    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      alert('Resume uploaded successfully!');
      setFormData({ name: '', school: '', resume: null });
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--primary)' }}>
          Tell Us About Yourself
        </h1>
        <p style={{ fontSize: '1rem', color: '#6b7280' }}>
          Upload your resume and we will build your network profile
        </p>
      </div>

      {/* Name Input */}
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--foreground)' }}>
          Full Name *
        </label>
        <Input
          type="text"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: (e.target as HTMLInputElement).value }))}
          variant="outlined"
        />
      </div>

      {/* School Input */}
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--foreground)' }}>
          School/University *
        </label>
        <Input
          type="text"
          placeholder="Stanford University"
          value={formData.school}
          onChange={(e) => setFormData(prev => ({ ...prev, school: (e.target as HTMLInputElement).value }))}
          variant="outlined"
        />
      </div>

      {/* Resume Upload */}
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--foreground)' }}>
          Upload Resume (DOCX) *
        </label>
        <div
          style={{
            border: '2px dashed var(--primary)',
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            backgroundColor: formData.resume ? 'var(--primary)' : '#f9fafb'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
            (e.currentTarget as HTMLElement).style.backgroundColor = '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)';
            (e.currentTarget as HTMLElement).style.backgroundColor = formData.resume ? 'var(--primary)' : '#f9fafb';
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
            <div style={{ fontSize: '1rem', fontWeight: '500', color: formData.resume ? 'white' : 'var(--foreground)', marginBottom: '4px' }}>
              {formData.resume ? formData.resume.name : 'Click to upload or drag and drop'}
            </div>
            <div style={{ fontSize: '0.875rem', color: formData.resume ? 'rgba(255,255,255,0.8)' : '#6b7280' }}>
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
        {isLoading ? 'Processing...' : 'Build My Network'}
      </Button>

      <p style={{ fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center' }}>
        Your information is secure and will be used only to create your network profile
      </p>
    </form>
  );
}
