'use client';

import React, { useState } from "react";
import StaticHeader from "../../components/layout/StaticHeader"
import PersonCard from "../../components/network_page/PersonCard";
import Connections from "../../components/network_page/Connections";

export default function NetworkPage() {
  const [selectedPersonName, setSelectedPersonName] = useState<string | null>(null);

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      <StaticHeader />
      <div 
        className="flex flex-1 overflow-hidden" 
        style={{
          background: 'linear-gradient(135deg, #F5F5F5 0%, #E8E8F0 100%)',
          position: 'relative'
        }}
      >
        {/* Animated gradient background elements */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(69, 103, 204, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(196, 65, 185, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
        
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
          <PersonCard selectedPersonName={selectedPersonName} onSelectPerson={setSelectedPersonName} />
          <Connections selectedPersonName={selectedPersonName} onSelectPerson={setSelectedPersonName} />
        </div>
      </div>
    </div>
  );
}
