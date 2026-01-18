'use client';

import React, { useState } from "react";
import StaticHeader from "../../components/layout/StaticHeader"
import PersonCard from "../../components/network_page/PersonCard";
import Connections from "../../components/network_page/Connections";
import ConnectModal from "../../components/network_page/ConnectModal";
import { mockPersonsData } from "../../data/connectionsData";

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

export default function NetworkPage() {
  const [selectedPersonName, setSelectedPersonName] = useState<string | null>(null);
  const [connectionsData] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const storedData = sessionStorage.getItem('connectionsData');
      if (storedData) {
        // Keep the data in sessionStorage - don't clear it yet
        return storedData;
      }
    }
    // Fall back to mock data if no stored data
    return JSON.stringify(mockPersonsData);
  });

  const [resumeFile] = useState<File | null>(() => {
    // For now, we'll load from temp folder when needed
    // The actual file will be fetched via API call
    return null;
  });

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedPersonForConnect, setSelectedPersonForConnect] = useState<PersonData | null>(null);

  const handleConnectClick = (personName: string) => {
    console.log('handleConnectClick called with:', personName);
    console.log('connectionsData available:', !!connectionsData);
    if (connectionsData) {
      try {
        const parsedData = JSON.parse(connectionsData) as PersonData[];
        const person = parsedData.find(p => p.name === personName);
        console.log('Found person:', person);
        if (person) {
          setSelectedPersonForConnect(person);
          setIsConnectModalOpen(true);
          console.log('Modal opened for:', personName);
        } else {
          console.error('Person not found:', personName);
        }
      } catch (error) {
        console.error('Failed to find person:', error);
      }
    } else {
      console.error('No connections data available');
    }
  };

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
          <PersonCard selectedPersonName={selectedPersonName} onSelectPerson={setSelectedPersonName} connectionsData={connectionsData} />
          <Connections selectedPersonName={selectedPersonName} onSelectPerson={setSelectedPersonName} connectionsData={connectionsData} onConnect={handleConnectClick} />
        </div>
      </div>

      {/* Connect Modal */}
      <ConnectModal
        person={selectedPersonForConnect}
        isOpen={isConnectModalOpen}
        onClose={() => {
          setIsConnectModalOpen(false);
          setSelectedPersonForConnect(null);
        }}
        resumeFile={resumeFile}
      />
    </div>
  );
}
