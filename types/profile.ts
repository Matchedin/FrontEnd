export interface ExperienceEntry {
	Title?: string;
	Company?: string;
	Duration?: string;
	Description?: string;
}

export interface EducationEntry {
	School?: string;
	Degree?: string;
	Field?: string;
	Years?: string;
}

export interface Profile {
	ProfileId: string;
	Name?: string;
	Email?: string;
	Location?: string;
	Headline?: string;
	About?: string;
	RoleCurrent?: string;
	CurrentCompany?: string;
	Industry?: string;
	YearsExperience?: number;
	SeniorityLevel?: string;
	Skills?: string[];
	Experience?: ExperienceEntry[];
	Education?: EducationEntry[];
	Connections?: number;
	Goals?: string[];
	Needs?: string[];
	CanOffer?: string[];
	RemotePreference?: string;
	Source?: string;
}
