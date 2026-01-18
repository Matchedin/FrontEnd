'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { mockPersonsData } from '../../data/connectionsData';

interface PersonData {
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

interface PersonCardProps {
  selectedPersonName: string | null;
  onSelectPerson: (name: string) => void;
  connectionsData?: string | null;
}

export default function PersonCard({ selectedPersonName, onSelectPerson, connectionsData }: PersonCardProps) {
  const people = useMemo(() => {
    if (connectionsData) {
      try {
        // Parse the JSON string from the API response
        const parsedData = JSON.parse(connectionsData) as PersonData[];
        // Ensure rank is always set (use index + 1 as fallback)
        return parsedData.slice(0, 50).map((person, index) => ({
          ...person,
          rank: person.rank ?? index + 1
        }));
      } catch (error) {
        console.error('Failed to parse connections data:', error);
        return mockPersonsData.slice(0, 50);
      }
    }
    // Fallback to mock data if no connectionsData provided
    return mockPersonsData.slice(0, 50);
  }, [connectionsData]);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedCardRef = useRef<HTMLDivElement>(null);
  
  const selectedIndex = useMemo(() => {
    return people.findIndex(p => p.name === selectedPersonName);
  }, [selectedPersonName, people]);

  // Auto-scroll to center selected card
  useEffect(() => {
    if (selectedCardRef.current) {
      selectedCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' && selectedIndex > 0) {
      onSelectPerson(people[selectedIndex - 1].name);
    } else if (e.key === 'ArrowDown' && selectedIndex < people.length - 1) {
      onSelectPerson(people[selectedIndex + 1].name);
    }
  };

  return (
    <div
      style={{
        width: '350px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 80px)',
        boxShadow: '0 8px 32px rgba(69, 103, 204, 0.1)'
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(69, 103, 204, 0.1)' }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold', 
          margin: 0,
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          All Connections
        </h2>
      </div>

      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '12px',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollPaddingTop: '200px',
          scrollPaddingBottom: '200px'
        }}
      >
        {/* Hide scrollbar for webkit browsers */}
        <style>{`
          [style*="scrollbar-width: none"] {
            scrollbar-width: none;
          }
          [style*="scrollbar-width: none"]::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {people.map((person, index) => {
          const isSelected = selectedIndex === index;
          
          return (
            <div
              key={index}
              ref={isSelected ? selectedCardRef : null}
              onClick={() => onSelectPerson(person.name)}
              style={{
                padding: '12px',
                borderRadius: '12px',
                cursor: 'pointer',
                background: isSelected 
                  ? 'linear-gradient(135deg, var(--primary) 0%, rgba(69, 103, 204, 0.8) 100%)'
                  : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                color: isSelected ? 'white' : 'var(--foreground)',
                border: isSelected 
                  ? '2px solid rgba(255, 255, 255, 0.5)'
                  : '1px solid rgba(69, 103, 204, 0.2)',
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                boxShadow: isSelected
                  ? '0 8px 24px rgba(69, 103, 204, 0.25)'
                  : '0 2px 8px rgba(0, 0, 0, 0.05)',
                minHeight: '66px',
                display: 'flex',
                alignItems: 'center',
                flex: '0 0 auto',
                willChange: 'background, color, border, box-shadow'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.95)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(69, 103, 204, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.85)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }
              }}
            >
              <div style={{ width: '100%' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: isSelected ? '4px' : '0px' }}>
                  <span style={{ 
                    color: isSelected ? 'rgba(255, 255, 255, 0.9)' : 'var(--primary)',
                    marginRight: '6px'
                  }}>
                    #{(person as unknown as Record<string, number>).rank || index + 1}
                  </span>
                  {person.name}
                </div>
                {isSelected && (
                  <>
                    <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '4px' }}>{person.current_company}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>{person.headline}</div>
                  </>
                )}
                {!isSelected && (
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{person.current_company}</div>
                )}
              </div>
            </div>
          );
        })}
        {/* Bottom spacer to prevent yanking when scrolling to last items */}
        <div style={{ height: '400px', flex: '0 0 auto' }} />
      </div>

      <div style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.8rem', opacity: 0.6 }}>
        Use arrow keys or click to navigate
      </div>
    </div>
  );
}
