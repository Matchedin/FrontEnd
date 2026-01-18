
export interface ExperienceEntry {
	title?: string;
	company?: string;
	duration?: string;
	description?: string;
}

export interface EducationEntry {
	school?: string;
	degree?: string;
	field?: string;
	years?: string;
}

export interface Profile {
	profileId: string;
	name?: string;
	email?: string;
	location?: string;
	headline?: string;
	about?: string;
	roleCurrent?: string;
	currentCompany?: string;
	industry?: string;
	yearsExperience?: number;
	seniorityLevel?: string;
	skills?: string[];
	experience?: ExperienceEntry[];
	education?: EducationEntry[];
	connections?: number;
	goals?: string[];
	needs?: string[];
	canOffer?: string[];
	remotePreference?: string;
	source?: string;
}
