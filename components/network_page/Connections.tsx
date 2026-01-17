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
  const [isExpanded, setIsExpanded] = useState(false);
  // separate progress values so we don't restart the entire animation on expand/collapse
  const [initialAnimationProgress, setInitialAnimationProgress] = useState(0); // for ranks 1-25
  const [extraAnimationProgress, setExtraAnimationProgress] = useState(0); // for ranks 26-50
  const [extraAnimationState, setExtraAnimationState] = useState<'idle' | 'entering' | 'exiting'>('idle');
  
  // Use the full list (up to 50) for position calculations but control rendering
  const allConnections = useMemo(() => mockPersonsData.slice(0, 50), []);
  
  // Find selected node based on person name
  const selectedNode = selectedPersonName ? allConnections.find(p => p.name === selectedPersonName) : null;
    
  const containerSize = 1000;
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;

  // Fit / recenter helpers (defined after positions)

  // Initial mount animation for ranks 1-25
  React.useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const duration = 1000;
    const tick = () => {
      if (start === null) start = Date.now();
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setInitialAnimationProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  

  // Right-side modal visibility (slides on/off). Keep selection separate.
  const [panelVisible, setPanelVisible] = useState<boolean>(!!selectedNode);
  React.useEffect(() => {
    setPanelVisible(!!selectedNode);
  }, [selectedNode]);
  const panelWidth = 320; // keep in sync with panel width

  // Extra animation for ranks 26-50 (entering / exiting)
  React.useEffect(() => {
    if (extraAnimationState === 'idle') return;
    let raf = 0;
    let start: number | null = null;
    const duration = 1200;
    const tick = () => {
      if (start === null) start = Date.now();
      const elapsed = Date.now() - start;
      let p = Math.min(elapsed / duration, 1);
      if (extraAnimationState === 'exiting') p = 1 - p;
      setExtraAnimationProgress(p);
      if (elapsed < duration) {
        raf = requestAnimationFrame(tick);
      } else {
        // finalize states
        if (extraAnimationState === 'exiting') {
          setIsExpanded(false);
        }
        setExtraAnimationState('idle');
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [extraAnimationState]);

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
    const zoomSpeed = 0.2;
    const newZoom = Math.max(0.05, Math.min(3, zoom - (e.deltaY > 0 ? zoomSpeed : -zoomSpeed)));

    // Adjust offset to keep the same canvas point at viewport center
    const newOffsetX = -(canvasX * newZoom - viewportCenterX);
    const newOffsetY = -(canvasY * newZoom - viewportCenterY);

    setZoom(newZoom);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  // Calculate positions for all nodes (use full set up to 50)
  const positions = useMemo<NodePosition[]>(() => {
    return allConnections.map((person) => {
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
      // Ranks 26-38: increase 6px per node (moderate expansion)
      // Ranks 39-50: increase 3px per node (slow final expansion)
      let distance;
      if (person.rank <= 15) {
        distance = startDistance + (person.rank - 1) * 10;
      } else if (person.rank <= 25) {
        const rank15Distance = startDistance + (15 - 1) * 10;
        distance = rank15Distance + (person.rank - 15) * 5;
      } else {
        const rank25Distance = startDistance + (15 - 1) * 10 + (25 - 15) * 5;
        if (person.rank <= 38) {
          distance = rank25Distance + (person.rank - 25) * 6;
        } else {
          const rank38Distance = rank25Distance + (38 - 25) * 6;
          distance = rank38Distance + (person.rank - 38) * 3;
        }
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
          if (i <= 38) {
            r = rank25Distance + (i - 25) * 6;
          } else {
            const rank38Distance = rank25Distance + (38 - 25) * 6;
            r = rank38Distance + (i - 38) * 3;
          }
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
  }, [centerX, centerY, allConnections]);

  // Fit / recenter helper: compute bounding box of current `positions`
  const fitToRanks = React.useCallback((maxRank: number) => {
    const visible = positions.filter(p => p.rank <= maxRank);
    if (visible.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    visible.forEach(p => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    });

    // add padding around bbox
    const padding = 160; // in canvas units
    const bboxW = Math.max(1, maxX - minX + padding);
    const bboxH = Math.max(1, maxY - minY + padding);

    // compute zoom to fit bbox into container
    const fitZoom = Math.max(0.35, Math.min(3, Math.min(containerSize / bboxW, containerSize / bboxH)));

    const centerCanvasX = (minX + maxX) / 2;
    const centerCanvasY = (minY + maxY) / 2;

    // Adjust viewport center: always account for panel width so spiral is pre-centered
    // When panel closes, shift right; when panel opens, stay centered
    const effectiveViewportCenterX = centerX + (!panelVisible ? panelWidth / 2 : 0);

    const newOffsetX = -(centerCanvasX * fitZoom - effectiveViewportCenterX);
    const newOffsetY = -(centerCanvasY * fitZoom - centerY);

    setZoom(fitZoom);
    setOffset({ x: newOffsetX, y: newOffsetY });
  }, [positions, centerX, centerY, containerSize, panelVisible, panelWidth]);

  // Zoom to focus on a specific node with smooth animation
  const zoomToNode = React.useCallback((nodePosition: NodePosition) => {
    const zoomLevel = 2; // Close-up zoom level
    const animationDuration = 800; // Duration in ms
    
    // Center on the node, accounting for panel width
    const effectiveViewportCenterX = centerX + (!panelVisible ? panelWidth / 2 : 0);
    
    const targetOffsetX = -(nodePosition.x * zoomLevel - effectiveViewportCenterX);
    const targetOffsetY = -(nodePosition.y * zoomLevel - centerY);
    
    // Store start values
    const startZoom = zoom;
    const startOffsetX = offset.x;
    const startOffsetY = offset.y;
    
    let raf = 0;
    let start: number | null = null;
    
    const tick = () => {
      if (start === null) start = Date.now();
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Smooth easing function (ease-out cubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentZoom = startZoom + (zoomLevel - startZoom) * easeProgress;
      const currentOffsetX = startOffsetX + (targetOffsetX - startOffsetX) * easeProgress;
      const currentOffsetY = startOffsetY + (targetOffsetY - startOffsetY) * easeProgress;
      
      setZoom(currentZoom);
      setOffset({ x: currentOffsetX, y: currentOffsetY });
      
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [centerX, centerY, panelVisible, panelWidth, zoom, offset]);

  // Center on initial load to ranks 1-25
  React.useEffect(() => {
    const t = setTimeout(() => fitToRanks(25), 50);
    return () => clearTimeout(t);
  }, [fitToRanks]);

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
            // Calculate line animation based on per-section progress
            let nodeStartTime = 0;
            let nodeEndTime = 0;
            let lineAnimationProgress = 0;

            if (pos.rank <= 25) {
              const totalConnections = 25;
              const animationDuration = 0.12;
              const totalRequiredDuration = 1.0 + animationDuration;
              const staggerDelay = (pos.rank - 1) / (totalRequiredDuration * totalConnections);
              nodeStartTime = staggerDelay;
              nodeEndTime = Math.min(staggerDelay + animationDuration, 1.0);
              if (initialAnimationProgress >= nodeStartTime) {
                lineAnimationProgress = Math.min((initialAnimationProgress - nodeStartTime) / (nodeEndTime - nodeStartTime), 1);
              }
            } else {
              // ranks 26-50 use the extra animation progress
              // only draw lines for these nodes if expanded or in the middle of an enter/exit animation
              if (!(isExpanded || extraAnimationState !== 'idle' || extraAnimationProgress > 0)) {
                return null;
              }
              const newNodeIndex = pos.rank - 25;
              const newNodesCount = 25;
              const staggerDelay = (newNodeIndex - 1) / newNodesCount;
              nodeStartTime = staggerDelay;
              nodeEndTime = Math.min(staggerDelay + 0.12, 1.0);
              if (extraAnimationProgress >= nodeStartTime) {
                lineAnimationProgress = Math.min((extraAnimationProgress - nodeStartTime) / (nodeEndTime - nodeStartTime), 1);
              }
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
          // For new nodes (26-50), only animate when expanded or during extra animation
          let nodeStartTime = 0;
          let nodeEndTime = 0;

          // Determine if this node should be visible and at what stage
          let nodeAnimationProgress = 0;
          let isVisible = false;

          if (pos.rank <= 25) {
            const totalConnections = 25;
            const animationDuration = 0.12;
            const totalRequiredDuration = 1.0 + animationDuration;
            const staggerDelay = (pos.rank - 1) / (totalRequiredDuration * totalConnections);
            nodeStartTime = staggerDelay;
            nodeEndTime = Math.min(staggerDelay + animationDuration, 1.0);

            if (initialAnimationProgress >= nodeStartTime) {
              isVisible = true;
              nodeAnimationProgress = Math.min((initialAnimationProgress - nodeStartTime) / (nodeEndTime - nodeStartTime), 1);
            }
          } else {
            // ranks 26-50 use the extra animation progress
            if (!(isExpanded || extraAnimationState !== 'idle' || extraAnimationProgress > 0)) {
              return null;
            }

            const newNodeIndex = pos.rank - 25; // 1-25 for the new nodes
            const newNodesCount = 25;
            const staggerDelay = (newNodeIndex - 1) / newNodesCount;
            nodeStartTime = staggerDelay;
            nodeEndTime = Math.min(staggerDelay + 0.12, 1.0);

            if (extraAnimationProgress >= nodeStartTime) {
              isVisible = true;
              nodeAnimationProgress = Math.min((extraAnimationProgress - nodeStartTime) / (nodeEndTime - nodeStartTime), 1);
            }
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
            onClick={() => {
              onSelectPerson(pos.name);
              setPanelVisible(true);
              zoomToNode(pos);
            }}
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
              // Start extra enter animation for nodes 26-50
              setIsExpanded(true);
              setExtraAnimationProgress(0);
              setExtraAnimationState('entering');
              // recenter & zoom to fit expanded set
              setTimeout(() => fitToRanks(50), 50);
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
              transition: 'box-shadow 0.3s ease, transform 300ms cubic-bezier(0.2,0.8,0.2,1)',
              transform: panelVisible ? `translateX(-${panelWidth}px)` : 'translateX(0)',
              zIndex: 70
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(69, 103, 204, 0.35)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(69, 103, 204, 0.2)';
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
              transition: 'box-shadow 0.3s ease, transform 300ms cubic-bezier(0.2,0.8,0.2,1)',
              transform: panelVisible ? `translateX(-${panelWidth}px)` : 'translateX(0)',
              zIndex: 70
            }}
            onClick={() => {
              // Animate extra nodes out, then effect will setIsExpanded(false)
              setExtraAnimationProgress(1);
              setExtraAnimationState('exiting');
              // recenter & zoom to fit collapsed set
              setTimeout(() => fitToRanks(25), 50);
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(196, 65, 185, 0.35)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(196, 65, 185, 0.2)';
            }}
          >
            Collapse Connections
          </button>
        )}
      </div>

      {/* Right Detail Panel (always rendered; slides on/off) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: '320px',
          transform: panelVisible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms cubic-bezier(0.2,0.8,0.2,1)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderLeft: '1px solid rgba(0,0,0,0.05)',
          boxShadow: panelVisible ? '-8px 0 32px rgba(69, 103, 204, 0.08)' : 'none',
          zIndex: 60,
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>Details</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setPanelVisible(false)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: '1px solid rgba(0,0,0,0.06)',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>

          {(() => {
            const person = selectedNode ? mockPersonsData.find(p => p.name === selectedNode.name) : null;
            return person ? (
              <>
                <div style={{ marginTop: '10px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(69, 103, 204, 0.06)' }}>
                  <h2 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    margin: '30px 0 4px 0',
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
            ) : (
              <div style={{ color: '#6b7280' }}>Select a person to see details.</div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
