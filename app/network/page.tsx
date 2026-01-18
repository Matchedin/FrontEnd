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
        const rawData = JSON.parse(connectionsData);
        
        // Parse array helper - same as in Connections component
        const parseArray = (value: unknown): string[] => {
          if (typeof value === 'string') {
            try {
              return JSON.parse(value.replace(/'/g, '"'));
            } catch {
              return [value];
            }
          }
          return Array.isArray(value) ? value : [];
        };
        
        // Flatten nested structure if needed
        let flatData: Array<Record<string, unknown>> = [];
        if (rawData.top_25_people && rawData.last_50_people) {
          flatData = [...(rawData.top_25_people as Array<Record<string, unknown>>), ...(rawData.last_50_people as Array<Record<string, unknown>>)];
        } else if (Array.isArray(rawData)) {
          flatData = rawData as Array<Record<string, unknown>>;
        } else {
          flatData = Object.values(rawData).flat() as Array<Record<string, unknown>>;
        }
        
        // Transform the data to ensure arrays are properly parsed
        const transformedData: PersonData[] = flatData.map((person: Record<string, unknown>, index: number) => ({
          name: String(person.name || ''),
          email: String(person.email || ''),
          location: String(person.location || ''),
          headline: String(person.headline || ''),
          about: String(person.about || ''),
          current_role: String(person.current_role || ''),
          current_company: String(person.current_company || ''),
          industry: String(person.industry || ''),
          rank: (person.rank as number) ?? index + 1,
          skills: parseArray(person.skills),
          can_offer: parseArray(person.can_offer),
          needs: parseArray(person.needs)
        }));
        
        const person = transformedData.find(p => p.name === personName);
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
