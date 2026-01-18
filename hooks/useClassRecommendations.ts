import { useState, useEffect, useCallback } from 'react';

export interface ClassRecommendation {
  className: string;
  description: string;
}

interface UseClassRecommendationsReturn {
  recommendations: ClassRecommendation[];
  isLoading: boolean;
  isSearching: boolean;
  extractedSkills: string[];
  error: string;
  hasAutoLoaded: boolean;
  fetchRecommendations: (university: string, skills: string[]) => Promise<void>;
  autoLoadRecommendations: (university: string) => Promise<void>;
}

export function useClassRecommendations(): UseClassRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<ClassRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [hasAutoLoaded, setHasAutoLoaded] = useState(false);

  // Extract skills from resume text
  const extractSkillsFromResume = useCallback((text: string): string[] => {
    const commonSkills = [
      'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'React', 'Vue', 'Angular',
      'Node.js', 'Express', 'Django', 'Flask', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure', 'GCP',
      'Machine Learning', 'Deep Learning', 'Data Science', 'Data Analysis', 'Statistics',
      'Web Development', 'Full Stack', 'Frontend', 'Backend', 'DevOps', 'Docker', 'Kubernetes',
      'Leadership', 'Communication', 'Project Management', 'Agile', 'Scrum',
      'UI/UX', 'Design', 'Figma', 'Adobe', 'Git', 'Linux', 'API', 'REST'
    ];

    const found: string[] = [];
    const lowerText = text.toLowerCase();
    
    commonSkills.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase()) && !found.includes(skill)) {
        found.push(skill);
      }
    });

    return found.slice(0, 10);
  }, []);

  // Load resume from temp folder on mount
  useEffect(() => {
    const loadResumeFromTemp = async () => {
      try {
        const response = await fetch('/api/get-resume');
        if (!response.ok) {
          throw new Error('Resume file not found in temp folder');
        }
        const data = await response.json();
        
        // Extract skills from resume text
        const skills = extractSkillsFromResume(data.text);
        setExtractedSkills(skills);
      } catch (err) {
        setError('Could not load resume from temp folder');
        // Silently fail - this is expected when no data has been uploaded
      } finally {
        setIsLoading(false);
      }
    };

    loadResumeFromTemp();
  }, [extractSkillsFromResume]);

  // Fetch class recommendations
  const fetchRecommendations = useCallback(async (university: string, skills: string[]) => {
    if (!university.trim()) {
      setError('Please enter a university');
      return;
    }

    if (skills.length === 0) {
      setError('No skills found in resume');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const response = await fetch('/api/lookup-skill-classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          university,
          skills
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch class recommendations');
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle different response formats
      let classes = [];
      if (Array.isArray(data)) {
        classes = data;
      } else if (data.recommended_classes && Array.isArray(data.recommended_classes)) {
        classes = data.recommended_classes;
      } else if (data.classes && Array.isArray(data.classes)) {
        classes = data.classes;
      } else if (typeof data === 'object' && data !== null) {
        // Try to find array in response
        const firstKey = Object.keys(data)[0];
        if (firstKey && Array.isArray(data[firstKey])) {
          classes = data[firstKey];
        }
      }
      
      console.log('Parsed classes:', classes);
      setRecommendations(classes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching recommendations:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Auto-load recommendations for university (called when connections data is available)
  const autoLoadRecommendations = useCallback(async (university: string) => {
    if (hasAutoLoaded) return;
    
    // If skills are already extracted, fetch immediately
    if (extractedSkills.length > 0) {
      setHasAutoLoaded(true);
      await fetchRecommendations(university, extractedSkills);
    }
    // Otherwise, will be triggered after resume loads (see useEffect below)
  }, [extractedSkills, hasAutoLoaded, fetchRecommendations]);

  // Auto-load after resume is loaded if university was provided
  useEffect(() => {
    if (!isLoading && extractedSkills.length > 0 && !hasAutoLoaded) {
      const userInfoStr = sessionStorage.getItem('userInfo');
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          const university = userInfo.school || '';
          if (university) {
            setHasAutoLoaded(true);
            fetchRecommendations(university, extractedSkills);
          }
        } catch (err) {
          console.error('Error parsing user info:', err);
        }
      }
    }
  }, [isLoading, extractedSkills, hasAutoLoaded, fetchRecommendations]);

  return {
    recommendations,
    isLoading,
    isSearching,
    extractedSkills,
    error,
    hasAutoLoaded,
    fetchRecommendations,
    autoLoadRecommendations
  };
}
