'use client';

import React, { useState, useMemo } from 'react';

const mockCurrentUser = {
  name: 'You',
  email: 'user@email.com',
  location: 'San Francisco, CA',
  headline: 'Your Headline Here',
  about: 'Your bio and background information will appear here.',
  current_role: 'Your Title',
  current_company: 'Your Company',
  can_offer: ['Your Skills', 'Your Expertise'],
  industry: 'Your Industry',
  skills: ['Skill 1', 'Skill 2', 'Skill 3'],
  needs: ['What you need', 'Collaboration opportunities']
};

const mockConnections = [
  { name: 'Sarah Johnson', current_company: 'Tech Corp', rank: 1 },
  { name: 'Michael Chen', current_company: 'StartupXYZ', rank: 2 },
  { name: 'Jessica Williams', current_company: 'Design Studios Inc', rank: 3 },
  { name: 'David Martinez', current_company: 'AI Innovations', rank: 4 },
  { name: 'Emily Rodriguez', current_company: 'Growth Partners LLC', rank: 5 },
  { name: 'James Thompson', current_company: 'Brand Co', rank: 6 },
  { name: 'Rachel Lee', current_company: 'Capital Ventures', rank: 7 },
  { name: 'Kevin Anderson', current_company: 'Enterprise Solutions', rank: 8 },
  { name: 'Lisa Wong', current_company: 'Operations Pro', rank: 9 },
  { name: 'Robert Garcia', current_company: 'Human Resources Plus', rank: 10 },
  { name: 'Amanda White', current_company: 'Logistics Hub', rank: 11 },
  { name: 'Christopher Lee', current_company: 'Mobile Innovations', rank: 12 },
  { name: 'Nicole Davis', current_company: 'Quality Systems', rank: 13 },
  { name: 'Brandon Scott', current_company: 'Cyber Defense', rank: 14 },
  { name: 'Sophia Martinez', current_company: 'Success Solutions', rank: 15 },
  { name: 'Tyler Jackson', current_company: 'Cloud Infrastructure', rank: 16 },
  { name: 'Victoria Anderson', current_company: 'Legal Partners', rank: 17 },
  { name: 'Marcus Johnson', current_company: 'Design Innovations', rank: 18 },
  { name: 'Elena Petrov', current_company: 'Venture Capital Fund', rank: 19 },
  { name: 'Jonathan Kim', current_company: 'DevOps Solutions', rank: 20 },
  { name: 'Natalie Green', current_company: 'HealthTech Innovations', rank: 21 },
  { name: 'Gregory Hall', current_company: 'Green Solutions', rank: 22 },
  { name: 'Alexa Brown', current_company: 'Community Events', rank: 23 },
  { name: 'Daniel Park', current_company: 'Blockchain Labs', rank: 24 },
  { name: 'John Developer', current_company: 'Tech Startup', rank: 25 }
];

interface NodePosition {
  name: string;
  company: string;
  rank: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
}

// Deterministic pseudo-random function based on seed
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export default function Connections() {
  const [selectedNode, setSelectedNode] = useState<NodePosition | null>(null);
  const containerSize = 1000;
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;

  // Calculate positions for all nodes
  const positions = useMemo<NodePosition[]>(() => {
    return mockConnections.map((person) => {
      // Calculate distance based on rank (closer ranks are closer to center)
      // Rank 1-5: distance 150-200
      // Rank 6-15: distance 200-300
      // Rank 16-25: distance 300-400
      let baseDistance = 150;
      if (person.rank <= 5) {
        baseDistance = 150 + (person.rank - 1) * 10;
      } else if (person.rank <= 15) {
        baseDistance = 200 + (person.rank - 6) * 10;
      } else {
        baseDistance = 300 + (person.rank - 16) * 8;
      }

      // Add deterministic scatter based on rank
      const randomScatter = (seededRandom(person.rank) - 0.5) * 40;
      const distance = baseDistance + randomScatter;

      // Distribute around circle with deterministic variation
      const baseAngle = (person.rank / 25) * Math.PI * 2;
      const angleVariation = (seededRandom(person.rank * 2) - 0.5) * (Math.PI / 3);
      const angle = baseAngle + angleVariation;

      const x = centerX + distance * Math.cos(angle);
      const y = centerY + distance * Math.sin(angle);

      return {
        name: person.name,
        company: person.current_company,
        rank: person.rank,
        x,
        y,
        angle,
        distance
      };
    });
  }, [centerX, centerY]);

  return (
    <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
      {/* Network Visualization */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          position: 'relative'
        }}
      >
        <svg
          width={containerSize}
          height={containerSize}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Draw connecting lines from center to each person */}
          {positions.map((pos, idx) => (
            <line
              key={`line-${idx}`}
              x1={centerX}
              y1={centerY}
              x2={pos.x}
              y2={pos.y}
              stroke="#e5e7eb"
              strokeWidth={1}
              opacity={0.5}
            />
          ))}
        </svg>

        {/* Center User */}
        <div
          style={{
            position: 'absolute',
            left: centerX - 50,
            top: centerY - 50,
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            border: '4px solid white',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
          }}
        >
          <div>
            <div style={{ fontSize: '14px', marginBottom: '4px' }}>👤</div>
            {mockCurrentUser.name}
          </div>
        </div>

        {/* Connected Nodes */}
        {positions.map((pos, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: pos.x - 35,
              top: pos.y - 35,
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: selectedNode?.rank === pos.rank ? 'var(--accent)' : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--foreground)',
              fontWeight: '600',
              textAlign: 'center',
              fontSize: '11px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: `2px solid ${selectedNode?.rank === pos.rank ? 'var(--accent)' : 'var(--primary)'}`,
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              lineHeight: '1.1'
            }}
            onClick={() => setSelectedNode(pos)}
            onMouseEnter={(e) => {
              const element = e.currentTarget as HTMLElement;
              element.style.transform = 'scale(1.15)';
              element.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
              element.style.zIndex = '5';
            }}
            onMouseLeave={(e) => {
              const element = e.currentTarget as HTMLElement;
              element.style.transform = 'scale(1)';
              element.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              element.style.zIndex = '1';
            }}
          >
            <div>
              <div style={{ fontSize: '20px', marginBottom: '2px' }}>
                {pos.rank === selectedNode?.rank ? '✓' : '●'}
              </div>
              <div style={{ fontSize: '9px' }}>Rank #{pos.rank}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Detail Panel */}
      {selectedNode && (
        <div
          style={{
            width: '300px',
            backgroundColor: 'white',
            borderLeft: '1px solid #e5e7eb',
            padding: '24px',
            overflowY: 'auto',
            boxShadow: '-4px 0 8px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 4px 0', color: 'var(--primary)' }}>
              {selectedNode.name}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
              Rank: #{selectedNode.rank}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0 0 0' }}>
              {selectedNode.company}
            </p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--foreground)' }}>
              About Connection
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#374151' }}>
              This is a top {selectedNode.rank <= 5 ? 'tier-1' : selectedNode.rank <= 15 ? 'tier-2' : 'tier-3'} connection in your network. Click to learn more and connect.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => alert(`Viewing ${selectedNode.name}'s profile`)}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--secondary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary)';
              }}
            >
              View Profile
            </button>
            <button
              onClick={() => alert(`Connecting with ${selectedNode.name}`)}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = '1';
              }}
            >
              Connect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
