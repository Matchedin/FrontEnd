'use client';

import React, { useState } from 'react';

interface Person {
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
}

const mockData = {
  top_25_people: [
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      location: 'San Francisco, CA',
      headline: 'Senior Product Manager at Tech Corp',
      about: 'Passionate about building products that solve real problems. 10+ years in tech.',
      current_role: 'Senior Product Manager',
      current_company: 'Tech Corp',
      can_offer: ['Product Strategy', 'Mentorship', 'Industry Connections'],
      industry: 'Technology',
      skills: ['Product Management', 'Leadership', 'Data Analysis'],
      needs: ['Engineering Talent', 'Design Partnership']
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      location: 'New York, NY',
      headline: 'Full Stack Developer & Startup Founder',
      about: 'Built 3 startups, expertise in scalable systems. Looking to collaborate.',
      current_role: 'CTO',
      current_company: 'StartupXYZ',
      can_offer: ['Technical Advice', 'Code Reviews', 'Architecture Design'],
      industry: 'Software Development',
      skills: ['Full Stack Development', 'System Design', 'DevOps'],
      needs: ['Business Development', 'Marketing Expertise']
    },
    {
      name: 'Jessica Williams',
      email: 'jessica.williams@email.com',
      location: 'Austin, TX',
      headline: 'UX Designer & Creative Lead',
      about: 'Focused on user-centered design and brand strategy. Award-winning designer.',
      current_role: 'Creative Lead',
      current_company: 'Design Studios Inc',
      can_offer: ['Design Consultation', 'UX Strategy', 'Brand Development'],
      industry: 'Design',
      skills: ['UI/UX Design', 'Brand Strategy', 'User Research'],
      needs: ['Development Partners', 'Product Managers']
    },
    {
      name: 'David Martinez',
      email: 'david.martinez@email.com',
      location: 'Boston, MA',
      headline: 'Data Scientist & ML Engineer',
      about: 'Specializing in machine learning and data-driven insights for business.',
      current_role: 'ML Engineer',
      current_company: 'AI Innovations',
      can_offer: ['Data Analysis', 'ML Solutions', 'Technical Consulting'],
      industry: 'Artificial Intelligence',
      skills: ['Machine Learning', 'Python', 'Data Science'],
      needs: ['Product Integration', 'Domain Expertise']
    },
    {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      location: 'Seattle, WA',
      headline: 'Business Development Manager',
      about: 'Expert in B2B partnerships and business growth strategies.',
      current_role: 'Business Development Manager',
      current_company: 'Growth Partners LLC',
      can_offer: ['Partnership Opportunities', 'Business Strategy', 'Network Access'],
      industry: 'Business Services',
      skills: ['Business Development', 'Sales', 'Negotiation'],
      needs: ['Technology Solutions', 'Technical Team']
    },
    {
      name: 'James Thompson',
      email: 'james.thompson@email.com',
      location: 'Denver, CO',
      headline: 'Marketing Strategist & Content Creator',
      about: 'Helping companies build their brand presence and marketing strategies.',
      current_role: 'Marketing Director',
      current_company: 'Brand Co',
      can_offer: ['Marketing Strategy', 'Content Creation', 'Social Media'],
      industry: 'Marketing',
      skills: ['Digital Marketing', 'Content Strategy', 'Analytics'],
      needs: ['Product Teams', 'Technical Expertise']
    },
    {
      name: 'Rachel Lee',
      email: 'rachel.lee@email.com',
      location: 'Miami, FL',
      headline: 'Financial Advisor & Investment Manager',
      about: 'Specializing in startup funding and financial planning.',
      current_role: 'Investment Manager',
      current_company: 'Capital Ventures',
      can_offer: ['Funding Connections', 'Financial Planning', 'Investment Advice'],
      industry: 'Finance',
      skills: ['Finance', 'Investment Analysis', 'Fundraising'],
      needs: ['Promising Startups', 'Tech Teams']
    },
    {
      name: 'Kevin Anderson',
      email: 'kevin.anderson@email.com',
      location: 'Los Angeles, CA',
      headline: 'Sales Director & Account Management Expert',
      about: 'Building high-performing sales teams and managing enterprise accounts.',
      current_role: 'Sales Director',
      current_company: 'Enterprise Solutions',
      can_offer: ['Sales Training', 'Account Management', 'Revenue Strategy'],
      industry: 'Sales',
      skills: ['Sales Leadership', 'Account Management', 'Negotiation'],
      needs: ['Product Development', 'Technical Integration']
    },
    {
      name: 'Lisa Wong',
      email: 'lisa.wong@email.com',
      location: 'Toronto, Canada',
      headline: 'Project Manager & Operations Lead',
      about: 'Expert in agile methodologies and operational excellence.',
      current_role: 'Operations Director',
      current_company: 'Operations Pro',
      can_offer: ['Process Improvement', 'Project Management', 'Team Leadership'],
      industry: 'Operations',
      skills: ['Project Management', 'Agile', 'Operations'],
      needs: ['Technology Tools', 'Integration Support']
    },
    {
      name: 'Robert Garcia',
      email: 'robert.garcia@email.com',
      location: 'Phoenix, AZ',
      headline: 'HR Director & Talent Acquisition Manager',
      about: 'Building great teams and fostering company culture.',
      current_role: 'HR Director',
      current_company: 'Human Resources Plus',
      can_offer: ['Talent Recruitment', 'HR Strategy', 'Team Building'],
      industry: 'Human Resources',
      skills: ['HR Management', 'Recruitment', 'Team Culture'],
      needs: ['Growth Opportunities', 'Expansion Support']
    },
    {
      name: 'Amanda White',
      email: 'amanda.white@email.com',
      location: 'Chicago, IL',
      headline: 'Supply Chain Manager & Logistics Expert',
      about: 'Optimizing supply chains and improving operational efficiency.',
      current_role: 'Supply Chain Manager',
      current_company: 'Logistics Hub',
      can_offer: ['Supply Chain Optimization', 'Vendor Relations', 'Cost Reduction'],
      industry: 'Logistics',
      skills: ['Supply Chain', 'Logistics', 'Inventory Management'],
      needs: ['Technology Solutions', 'Data Analytics']
    },
    {
      name: 'Christopher Lee',
      email: 'christopher.lee@email.com',
      location: 'Portland, OR',
      headline: 'Mobile App Developer & Tech Lead',
      about: 'Creating innovative mobile applications and leading tech teams.',
      current_role: 'Tech Lead',
      current_company: 'Mobile Innovations',
      can_offer: ['App Development', 'Tech Leadership', 'Architecture Design'],
      industry: 'Mobile Development',
      skills: ['iOS Development', 'Android Development', 'React Native'],
      needs: ['Product Managers', 'Designers']
    },
    {
      name: 'Nicole Davis',
      email: 'nicole.davis@email.com',
      location: 'Atlanta, GA',
      headline: 'Quality Assurance Lead & Test Automation Expert',
      about: 'Ensuring product quality through comprehensive testing strategies.',
      current_role: 'QA Lead',
      current_company: 'Quality Systems',
      can_offer: ['QA Strategy', 'Test Automation', 'Quality Assurance'],
      industry: 'Quality Assurance',
      skills: ['QA Testing', 'Test Automation', 'Selenium'],
      needs: ['Development Teams', 'Tools Integration']
    },
    {
      name: 'Brandon Scott',
      email: 'brandon.scott@email.com',
      location: 'Houston, TX',
      headline: 'Cybersecurity Specialist & Security Architect',
      about: 'Protecting organizations from cyber threats and vulnerabilities.',
      current_role: 'Security Architect',
      current_company: 'Cyber Defense',
      can_offer: ['Security Consulting', 'Vulnerability Assessment', 'Risk Management'],
      industry: 'Cybersecurity',
      skills: ['Cybersecurity', 'Network Security', 'Penetration Testing'],
      needs: ['Enterprise Clients', 'Integration Partners']
    },
    {
      name: 'Sophia Martinez',
      email: 'sophia.martinez@email.com',
      location: 'Las Vegas, NV',
      headline: 'Customer Success Manager & Client Relations Expert',
      about: 'Building lasting customer relationships and ensuring satisfaction.',
      current_role: 'Customer Success Manager',
      current_company: 'Success Solutions',
      can_offer: ['Customer Strategy', 'Onboarding Support', 'Retention Strategy'],
      industry: 'Customer Success',
      skills: ['Customer Relations', 'Account Management', 'Retention'],
      needs: ['Product Teams', 'Support Resources']
    },
    {
      name: 'Tyler Jackson',
      email: 'tyler.jackson@email.com',
      location: 'Orlando, FL',
      headline: 'Cloud Architect & Infrastructure Engineer',
      about: 'Designing scalable cloud infrastructure and DevOps solutions.',
      current_role: 'Cloud Architect',
      current_company: 'Cloud Infrastructure',
      can_offer: ['Cloud Architecture', 'Infrastructure Design', 'DevOps Support'],
      industry: 'Cloud Computing',
      skills: ['AWS', 'Azure', 'Kubernetes'],
      needs: ['Development Teams', 'Application Builders']
    },
    {
      name: 'Victoria Anderson',
      email: 'victoria.anderson@email.com',
      location: 'Philadelphia, PA',
      headline: 'Legal Advisor & Compliance Expert',
      about: 'Providing legal guidance and ensuring regulatory compliance.',
      current_role: 'Legal Counsel',
      current_company: 'Legal Partners',
      can_offer: ['Legal Consulting', 'Compliance Review', 'Contract Review'],
      industry: 'Legal Services',
      skills: ['Corporate Law', 'Compliance', 'Contract Law'],
      needs: ['Growing Companies', 'Expansion Support']
    },
    {
      name: 'Marcus Johnson',
      email: 'marcus.johnson@email.com',
      location: 'San Diego, CA',
      headline: 'Product Designer & User Experience Strategist',
      about: 'Creating intuitive user experiences and product strategies.',
      current_role: 'Product Designer',
      current_company: 'Design Innovations',
      can_offer: ['Product Design', 'UX Strategy', 'Design Systems'],
      industry: 'Design',
      skills: ['Product Design', 'Figma', 'User Research'],
      needs: ['Development Partners', 'Startups']
    },
    {
      name: 'Elena Petrov',
      email: 'elena.petrov@email.com',
      location: 'Silicon Valley, CA',
      headline: 'Venture Capitalist & Angel Investor',
      about: 'Investing in early-stage startups and emerging technologies.',
      current_role: 'Venture Capitalist',
      current_company: 'Venture Capital Fund',
      can_offer: ['Funding', 'Mentorship', 'Network Access'],
      industry: 'Venture Capital',
      skills: ['Investment', 'Startup Strategy', 'Market Analysis'],
      needs: ['Promising Startups', 'Technical Teams']
    },
    {
      name: 'Jonathan Kim',
      email: 'jonathan.kim@email.com',
      location: 'Seattle, WA',
      headline: 'DevOps Engineer & Automation Specialist',
      about: 'Automating deployment processes and improving infrastructure.',
      current_role: 'DevOps Engineer',
      current_company: 'DevOps Solutions',
      can_offer: ['DevOps Strategy', 'Automation', 'CI/CD Pipeline'],
      industry: 'DevOps',
      skills: ['Docker', 'Jenkins', 'Terraform'],
      needs: ['Development Teams', 'Application Support']
    },
    {
      name: 'Natalie Green',
      email: 'natalie.green@email.com',
      location: 'Boston, MA',
      headline: 'Healthcare Technology Manager & Innovation Lead',
      about: 'Transforming healthcare through innovative technology solutions.',
      current_role: 'Innovation Manager',
      current_company: 'HealthTech Innovations',
      can_offer: ['Healthcare Insights', 'Innovation Strategy', 'Regulatory Knowledge'],
      industry: 'Healthcare',
      skills: ['Healthcare Tech', 'HIPAA Compliance', 'Product Management'],
      needs: ['Tech Development', 'Integration Specialists']
    },
    {
      name: 'Gregory Hall',
      email: 'gregory.hall@email.com',
      location: 'Minneapolis, MN',
      headline: 'Environmental Scientist & Sustainability Consultant',
      about: 'Promoting sustainable practices and environmental responsibility.',
      current_role: 'Sustainability Consultant',
      current_company: 'Green Solutions',
      can_offer: ['Sustainability Strategy', 'Environmental Consulting', 'ESG Guidance'],
      industry: 'Sustainability',
      skills: ['Environmental Science', 'Sustainability', 'ESG'],
      needs: ['Tech Solutions', 'Impact Measurement']
    },
    {
      name: 'Alexa Brown',
      email: 'alexa.brown@email.com',
      location: 'Miami, FL',
      headline: 'Event Manager & Community Builder',
      about: 'Creating memorable events and building vibrant communities.',
      current_role: 'Community Manager',
      current_company: 'Community Events',
      can_offer: ['Event Planning', 'Community Building', 'Networking Events'],
      industry: 'Events',
      skills: ['Event Planning', 'Community Management', 'Networking'],
      needs: ['Sponsorships', 'Partnership Opportunities']
    },
    {
      name: 'Daniel Park',
      email: 'daniel.park@email.com',
      location: 'Los Angeles, CA',
      headline: 'Blockchain Developer & Crypto Expert',
      about: 'Building decentralized applications and blockchain solutions.',
      current_role: 'Blockchain Developer',
      current_company: 'Blockchain Labs',
      can_offer: ['Blockchain Development', 'Smart Contracts', 'Crypto Consulting'],
      industry: 'Blockchain',
      skills: ['Solidity', 'Smart Contracts', 'Blockchain'],
      needs: ['Product Teams', 'Funding']
    }
  ]
};

export default function PersonCard() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(mockData.top_25_people[0]);

  return (
    <div
      style={{
        width: '350px',
        backgroundColor: 'var(--background)',
        borderRight: '1px solid #e5e7eb',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 80px)'
      }}
    >
      <div style={{ padding: '16px' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0 }}>Top 25 People</h2>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '8px'
        }}
      >
        {mockData.top_25_people.map((person, index) => (
          <div
            key={index}
            onClick={() => setSelectedPerson(person)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: selectedPerson?.name === person.name ? 'var(--primary)' : 'transparent',
              color: selectedPerson?.name === person.name ? 'white' : 'var(--foreground)',
              transition: 'all 0.2s ease',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}
            onMouseEnter={(e) => {
              if (selectedPerson?.name !== person.name) {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPerson?.name !== person.name) {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{person.name}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{person.current_company}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
