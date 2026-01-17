'use client';

import React, { useState, useMemo } from 'react';
import { mockPersonsData } from '../../data/connectionsData';

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

interface NodePosition {
  name: string;
  company: string;
  rank: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
}

interface ConnectionsProps {
  selectedPersonName: string | null;
  onSelectPerson: (name: string) => void;
}

// Deterministic pseudo-random function based on seed
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export default function Connections({ selectedPersonName, onSelectPerson }: ConnectionsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandAnimationStartTime, setExpandAnimationStartTime] = useState<number | null>(null);
  
  // Create mockConnections dynamically based on expanded state
  const mockConnections = useMemo(() => {
    const maxRank = isExpanded ? 50 : 25;
    return mockPersonsData.slice(0, maxRank).map(person => ({
      name: person.name,
      current_company: person.current_company,
      rank: person.rank
    }));
  }, [isExpanded]);
  
  // Find selected node based on person name
  const selectedNode = selectedPersonName ? 
    mockConnections.find(p => p.name === selectedPersonName) 
    : null;
    
  const containerSize = 1000;
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;

  // Animate nodes popping in from center
  React.useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = expandAnimationStartTime;

    const animate = () => {
      if (startTime === null) {
        startTime = Date.now();
      }
      
      // Increase duration to 5 seconds to handle 50+ nodes with proper stagger timing
      const duration = 5000;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [expandAnimationStartTime]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const viewportCenterX = rect.width / 2;
    const viewportCenterY = rect.height / 2;

    // Calculate the canvas point currently at viewport center
    const canvasX = (-offset.x + viewportCenterX) / zoom;
    const canvasY = (-offset.y + viewportCenterY) / zoom;

    // Calculate new zoom
    const zoomSpeed = 0.1;
    const newZoom = Math.max(0.5, Math.min(3, zoom - (e.deltaY > 0 ? zoomSpeed : -zoomSpeed)));

    // Adjust offset to keep the same canvas point at viewport center
    const newOffsetX = -(canvasX * newZoom - viewportCenterX);
    const newOffsetY = -(canvasY * newZoom - viewportCenterY);

    setZoom(newZoom);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  // Calculate positions for all nodes
  const positions = useMemo<NodePosition[]>(() => {
    return mockConnections.map((person) => {
      // Create a smooth spiral with consistent spacing between nodes
      // Rank 1 starts at top center and spirals outward
      
      // Start at top (12 o'clock)
      const startAngle = -Math.PI / 2;
      
      // Spiral parameters
      const startDistance = 120;
      const targetArcLength = 95; // Consistent spacing between nodes
      
      // Calculate radius for this node with extended scaling for 26-50
      // Ranks 1-15: increase 10px per node
      // Ranks 16-25: increase 5px per node
      // Ranks 26-50: increase 3px per node (slower expansion)
      let distance;
      if (person.rank <= 15) {
        distance = startDistance + (person.rank - 1) * 10;
      } else if (person.rank <= 25) {
        const rank15Distance = startDistance + (15 - 1) * 10;
        distance = rank15Distance + (person.rank - 15) * 5;
      } else {
        const rank25Distance = startDistance + (15 - 1) * 10 + (25 - 15) * 5;
        distance = rank25Distance + (person.rank - 25) * 3;
      }
      
      // Calculate angle increment to maintain consistent arc length
      // Arc length = radius * angle, so angle = arc length / radius
      let totalAngle = startAngle;
      for (let i = 1; i < person.rank; i++) {
        // Calculate radius at this iteration using the same dynamic logic
        let r;
        if (i <= 15) {
          r = startDistance + (i - 1) * 10;
        } else if (i <= 25) {
          const rank15Distance = startDistance + (15 - 1) * 10;
          r = rank15Distance + (i - 15) * 5;
        } else {
          const rank25Distance = startDistance + (15 - 1) * 10 + (25 - 15) * 5;
          r = rank25Distance + (i - 25) * 3;
        }
        totalAngle += targetArcLength / r;
      }
      
      const angle = totalAngle;
      
      // Minimal variation for organic feel
      const scatterVariation = (seededRandom(person.rank) - 0.5) * 3;
      const finalDistance = distance + scatterVariation;

      const x = centerX + finalDistance * Math.cos(angle);
      const y = centerY + finalDistance * Math.sin(angle);

      return {
        name: person.name,
        company: person.current_company,
        rank: person.rank,
        x,
        y,
        angle,
        distance: finalDistance
      };
    });
  }, [centerX, centerY, mockConnections]);

  return (
    <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
      {/* Network Visualization */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(245, 245, 245, 0.2) 100%)',
          position: 'relative',
          cursor: isDragging ? 'grabbing' : 'grab',
          overflow: 'hidden',
          backdropFilter: 'blur(5px)'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            position: 'absolute',
            top: 0,
            left: 0,
            transformOrigin: 'center center'
          }}
        >
        <svg
          width={containerSize}
          height={containerSize}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Draw connecting lines from center to each person */}
          {positions.map((pos, idx) => {
            // Calculate line animation based on node animation
            let nodeStartTime = 0;
            let nodeEndTime = 0;
            
            if (pos.rank <= 25) {
              // Original nodes
              const totalConnections = 25;
              const animationDuration = 0.12;
              const totalRequiredDuration = 1.0 + animationDuration;
              const staggerDelay = (pos.rank - 1) / (totalRequiredDuration * totalConnections);
              nodeStartTime = staggerDelay;
              nodeEndTime = Math.min(staggerDelay + 0.02, 1.0);
            } else if (isExpanded && expandAnimationStartTime) {
              // New nodes
              const newNodeIndex = pos.rank - 25;
              const newNodesCount = 25;
              const animationDuration = 0.12;
              const totalRequiredDuration = 1.0 + animationDuration;
              const staggerDelay = 0.85 + (newNodeIndex - 1) / (totalRequiredDuration * newNodesCount);
              nodeStartTime = Math.min(staggerDelay, 0.98);
              nodeEndTime = Math.min(nodeStartTime + 0.02, 1.0);
            }
            
            let lineAnimationProgress = 0;
            if (animationProgress >= nodeStartTime) {
              lineAnimationProgress = Math.min((animationProgress - nodeStartTime) / (nodeEndTime - nodeStartTime), 1);
            }
            
            // Calculate line length for stroke animation
            const dx = pos.x - centerX;
            const dy = pos.y - centerY;
            const lineLength = Math.sqrt(dx * dx + dy * dy);
            
            return (
              <line
                key={`line-${idx}`}
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke="#e5e7eb"
                strokeWidth={lineAnimationProgress > 0 ? 1.5 : 0}
                opacity={lineAnimationProgress * 0.6}
                strokeDasharray={lineLength}
                strokeDashoffset={lineLength * (1 - lineAnimationProgress)}
                style={{ transition: 'none' }}
                suppressHydrationWarning
              />
            );
          })}
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
            background: 'linear-gradient(135deg, var(--primary) 0%, rgba(69, 103, 204, 0.85) 100%)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: '0 12px 32px rgba(69, 103, 204, 0.25)',
            zIndex: 10,
            border: '2px solid rgba(255, 255, 255, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(69, 103, 204, 0.35)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(69, 103, 204, 0.25)';
          }}
        >
          <div>
            <div style={{ fontSize: '14px', marginBottom: '4px' }}>👤</div>
            {mockCurrentUser.name}
          </div>
        </div>

        {/* Connected Nodes */}
        {positions.map((pos, idx) => {
          // Calculate when this node should animate in (staggered)
          // For new nodes (26-50), only animate after expand happens
          let nodeStartTime = 0;
          let nodeEndTime = 0;
          
          if (pos.rank <= 25) {
            // Original nodes: distribute across full duration
            const totalConnections = 25;
            const animationDuration = 0.12;
            const totalRequiredDuration = 1.0 + animationDuration;
            const staggerDelay = (pos.rank - 1) / (totalRequiredDuration * totalConnections);
            nodeStartTime = staggerDelay;
            nodeEndTime = Math.min(staggerDelay + animationDuration, 1.0);
          } else if (isExpanded && expandAnimationStartTime) {
            // New nodes: start from expand time and animate in sequence after the first 25
            // Delay new nodes to start after original 25 are complete (around 85% progress)
            const newNodeIndex = pos.rank - 25; // 1-25 for the new nodes
            const newNodesCount = 25;
            const animationDuration = 0.12;
            const totalRequiredDuration = 1.0 + animationDuration;
            const staggerDelay = 0.85 + (newNodeIndex - 1) / (totalRequiredDuration * newNodesCount); // Start at 85%
            nodeStartTime = Math.min(staggerDelay, 0.98);
            nodeEndTime = Math.min(nodeStartTime + animationDuration, 1.0);
          }
          
          // Determine if this node should be visible and at what stage
          let nodeAnimationProgress = 0;
          let isVisible = false;
          
          if (animationProgress >= nodeStartTime) {
            isVisible = true;
            nodeAnimationProgress = Math.min((animationProgress - nodeStartTime) / (nodeEndTime - nodeStartTime), 1);
          }
          
          // Interpolate from center to final position
          const currentX = centerX + (pos.x - centerX) * nodeAnimationProgress;
          const currentY = centerY + (pos.y - centerY) * nodeAnimationProgress;
          
          // Scale and opacity animation (pop in effect)
          const scale = 0.3 + nodeAnimationProgress * 0.7; // Scale from 0.3 to 1
          const opacity = nodeAnimationProgress;
          
          // Make rank 1 larger than the rest
          const nodeSize = pos.rank === 1 ? 90 : 70;
          const nodeOffset = nodeSize / 2;
          
          return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: currentX - nodeOffset,
              top: currentY - nodeOffset,
              width: `${nodeSize}px`,
              height: `${nodeSize}px`,
              borderRadius: '50%',
              backgroundColor: selectedNode?.name === pos.name ? 'var(--accent)' : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--foreground)',
              fontWeight: '600',
              textAlign: 'center',
              fontSize: pos.rank === 1 ? '12px' : '11px',
              cursor: 'pointer',
              background: selectedNode?.name === pos.name 
                ? 'linear-gradient(135deg, var(--accent) 0%, rgba(196, 65, 185, 0.8) 100%)'
                : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              boxShadow: `0 8px 24px rgba(69, 103, 204, ${0.15 * opacity})`,
              border: `2px solid ${selectedNode?.name === pos.name ? 'rgba(255, 255, 255, 0.5)' : 'rgba(69, 103, 204, 0.3)'}`,
              transition: isDragging ? 'none' : 'all 0.3s ease',
              overflow: 'hidden',
              lineHeight: '1.1',
              opacity: isVisible ? opacity : 0,
              transform: `scale(${scale})`,
            }}
            onClick={() => onSelectPerson(pos.name)}
            onMouseEnter={(e) => {
              if (isVisible) {
                const element = e.currentTarget as HTMLElement;
                element.style.transform = `scale(${scale * 1.15})`;
                element.style.boxShadow = `0 12px 32px rgba(69, 103, 204, ${0.25 * opacity})`;
                element.style.zIndex = '5';
              }
            }}
            onMouseLeave={(e) => {
              if (isVisible) {
                const element = e.currentTarget as HTMLElement;
                element.style.transform = `scale(${scale})`;
                element.style.boxShadow = `0 8px 24px rgba(69, 103, 204, ${0.15 * opacity})`;
                element.style.zIndex = '1';
              }
            }}
          >
            <div>
              <div style={{ fontSize: pos.rank === 1 ? '24px' : '20px', marginBottom: '2px' }}>
                {pos.name === selectedNode?.name ? '✓' : '●'}
              </div>
              <div style={{ fontSize: '9px' }}>Rank #{pos.rank}</div>
            </div>
          </div>
        );
        })}
        </div>

        {/* Expand Button */}
        {!isExpanded && (
          <button
            onClick={() => {
              // Continue animation from current progress, so new nodes animate in
              setExpandAnimationStartTime(Date.now() - (animationProgress * 5000));
              setIsExpanded(true);
            }}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, var(--primary) 0%, rgba(69, 103, 204, 0.8) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(69, 103, 204, 0.2)',
              transition: 'all 0.3s ease',
              zIndex: 50
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(69, 103, 204, 0.35)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(69, 103, 204, 0.2)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            Expand Connections (26-50)
          </button>
        )}
        {isExpanded && (
          <button
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, var(--accent) 0%, rgba(196, 65, 185, 0.8) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(196, 65, 185, 0.2)',
              transition: 'all 0.3s ease',
              zIndex: 50
            }}
            onClick={() => {
              setIsExpanded(false);
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(196, 65, 185, 0.35)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(196, 65, 185, 0.2)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            Collapse Connections
          </button>
        )}
      </div>

      {/* Right Detail Panel */}
      {selectedNode && (
        <div
          style={{
            width: '300px',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(10px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '24px',
            overflowY: 'auto',
            boxShadow: '-8px 0 32px rgba(69, 103, 204, 0.1)'
          }}
        >
          {(() => {
            const person = mockPersonsData.find(p => p.name === selectedNode.name);
            return person ? (
              <>
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(69, 103, 204, 0.1)' }}>
                  <h2 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    margin: '0 0 4px 0',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {person.name}
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                    Rank: #{person.rank}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0 0 0' }}>
                    {person.current_company}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '4px 0 0 0' }}>
                    {person.headline}
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--primary)' }}>
                    About
                  </h3>
                  <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#374151' }}>
                    {person.about}
                  </p>
                </div>

                {person.can_offer && person.can_offer.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--primary)' }}>
                      Can Offer
                    </h3>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {person.can_offer.map((skill, i) => (
                        <span key={i} style={{
                          fontSize: '0.75rem',
                          background: 'linear-gradient(135deg, rgba(69, 103, 204, 0.1) 0%, rgba(69, 103, 204, 0.05) 100%)',
                          border: '1px solid rgba(69, 103, 204, 0.3)',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          color: 'var(--primary)',
                          fontWeight: '500'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {person.needs && person.needs.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '8px', color: 'var(--accent)' }}>
                      Looking For
                    </h3>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {person.needs.map((need, i) => (
                        <span key={i} style={{
                          fontSize: '0.75rem',
                          background: 'linear-gradient(135deg, rgba(196, 65, 185, 0.1) 0%, rgba(196, 65, 185, 0.05) 100%)',
                          border: '1px solid rgba(196, 65, 185, 0.3)',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          color: 'var(--accent)',
                          fontWeight: '500'
                        }}>
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                  <button
                    onClick={() => alert(`Viewing ${person.name}'s profile`)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'linear-gradient(135deg, var(--primary) 0%, rgba(69, 103, 204, 0.8) 100%)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(69, 103, 204, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(69, 103, 204, 0.3)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(69, 103, 204, 0.2)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => alert(`Connecting with ${person.name}`)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'linear-gradient(135deg, var(--accent) 0%, rgba(196, 65, 185, 0.8) 100%)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(196, 65, 185, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(196, 65, 185, 0.3)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(196, 65, 185, 0.2)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    Connect
                  </button>
                </div>
              </>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}
