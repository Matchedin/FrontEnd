'use client';

import React, { useEffect, useState, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  id: number;
}

export default function InfoAnimation() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Initialize nodes
  useEffect(() => {
    const nodeCount = 24;
    const initialNodes: Node[] = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      x: Math.random() * 400,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    }));
    nodesRef.current = initialNodes;
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;
    let animationFrame: number;

    const animate = () => {
      // Set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Clear canvas
      ctx.fillStyle = 'rgba(255, 255, 255, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update progress (0 to 1)
      frameCount++;
      const progress = Math.min((frameCount / 300) * 1, 1);
      setAnimationProgress(progress);

      // Update nodes
      const updatedNodes = nodesRef.current.map(node => {
        let newX = node.x + node.vx;
        let newY = node.y + node.vy;
        let newVx = node.vx;
        let newVy = node.vy;

        // Bounce off walls
        if (newX < 0 || newX > canvas.width) newVx *= -1;
        if (newY < 0 || newY > canvas.height) newVy *= -1;

        newX = Math.max(0, Math.min(canvas.width, newX));
        newY = Math.max(0, Math.min(canvas.height, newY));

        return { ...node, x: newX, y: newY, vx: newVx, vy: newVy };
      });
      nodesRef.current = updatedNodes;

      // Draw connecting lines (spiderweb effect)
      ctx.strokeStyle = `rgba(69, 103, 204, ${0.2 * progress})`;
      ctx.lineWidth = 1;

      for (let i = 0; i < updatedNodes.length; i++) {
        for (let j = i + 1; j < updatedNodes.length; j++) {
          const dx = updatedNodes[j].x - updatedNodes[i].x;
          const dy = updatedNodes[j].y - updatedNodes[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(updatedNodes[i].x, updatedNodes[i].y);
            ctx.lineTo(updatedNodes[j].x, updatedNodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      updatedNodes.forEach((node, idx) => {
        const scale = 1 + Math.sin(frameCount * 0.05 + idx) * 0.2;
        const nodeSize = 6 * scale;

        // Node glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeSize * 2);
        gradient.addColorStop(0, `rgba(69, 103, 204, ${0.4 * progress})`);
        gradient.addColorStop(1, `rgba(69, 103, 204, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize * 2, 0, Math.PI * 2);
        ctx.fill();

        // Node core
        ctx.fillStyle = `rgba(69, 103, 204, ${0.8 + 0.2 * Math.sin(frameCount * 0.05 + idx)})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();

        // Node ring
        ctx.strokeStyle = `rgba(196, 65, 185, ${progress})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw center connection node
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.fillStyle = `rgba(196, 65, 185, ${0.5 + 0.5 * progress})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(196, 65, 185, ${progress})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
      ctx.stroke();

      // Draw lines from center to nodes
      ctx.strokeStyle = `rgba(196, 65, 185, ${0.3 * progress})`;
      ctx.lineWidth = 1;
      updatedNodes.forEach(node => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();
      });

      // Add center glow
      const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40);
      centerGradient.addColorStop(0, `rgba(196, 65, 185, ${0.2 * progress})`);
      centerGradient.addColorStop(1, `rgba(196, 65, 185, 0)`);
      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
      ctx.fill();

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(69, 103, 204, 0.05) 0%, rgba(196, 65, 185, 0.03) 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '32px',
          right: '32px',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '0.875rem', color: 'rgba(32, 32, 32, 0.7)', marginBottom: '8px' }}>
          Building your network...
        </div>
        <div
          style={{
            width: '100%',
            height: '4px',
            background: 'rgba(69, 103, 204, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
            border: '1px solid rgba(69, 103, 204, 0.2)'
          }}
        >
          <div
            style={{
              width: `${animationProgress * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
              transition: 'width 0.1s linear'
            }}
          />
        </div>
      </div>
    </div>
  );
}
