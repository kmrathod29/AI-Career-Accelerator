export const ACCOUNT_STORAGE_KEY = 'ai-career-accelerator-account'

export const ACCOUNT_SECTIONS = [
	{ id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
	{ id: 'personal', label: 'Personal Information', icon: 'User' },
	{ id: 'career', label: 'Career Information', icon: 'Briefcase' },
	{ id: 'social', label: 'Social Links', icon: 'Link2' },
	{ id: 'appearance', label: 'Appearance', icon: 'Palette' },
	{ id: 'notifications', label: 'Notifications', icon: 'Bell' },
	{ id: 'security', label: 'Security', icon: 'Shield' },
	{ id: 'privacy', label: 'Privacy', icon: 'Eye' },
	{ id: 'sessions', label: 'Sessions', icon: 'MonitorSmartphone' },
	{ id: 'data', label: 'Data & Export', icon: 'Download' },
	{ id: 'danger', label: 'Danger Zone', icon: 'AlertTriangle' },
]

export const DEFAULT_PROFILE = {
	firstName: 'Krunal',
	lastName: 'Rathod',
	email: 'krunal@careeraccelerator.ai',
	phone: '+91 98765 43210',
	gender: 'male',
	dateOfBirth: '2002-05-15',
	country: 'India',
	city: 'Mumbai',
	state: 'Maharashtra',
	bio: 'Aspiring full-stack engineer passionate about building AI-powered products. Currently focused on React, Node.js, and system design.',
	avatar: null,
	coverImage: null,
	role: 'Full Stack Developer',
	joinedAt: '2024-09-12',
	currentRole: 'Software Engineering Intern',
	experienceLevel: 'entry',
	education: 'bachelors',
	university: 'Dharmsinh Desai University',
	degree: 'B.Tech',
	branch: 'Computer Engineering',
	passingYear: '2026',
	skills: ['React', 'Node.js', 'TypeScript', 'Python', 'System Design'],
	preferredRole: 'Full Stack Developer',
	preferredLocation: 'Remote / Bangalore',
	expectedSalary: '8-12 LPA',
	employmentType: 'full-time',
	social: {
		linkedin: 'https://linkedin.com/in/krunalrathod',
		github: 'https://github.com/krunalrathod',
		portfolio: 'https://krunal.dev',
		leetcode: 'https://leetcode.com/krunalrathod',
		codeforces: 'https://codeforces.com/profile/krunalrathod',
		hackerrank: 'https://hackerrank.com/krunalrathod',
		website: 'https://krunal.dev',
	},
}

export const DEFAULT_STATS = {
	resumesCreated: 3,
	atsAnalyses: 12,
	mockInterviews: 8,
	careerRoadmaps: 2,
}

export const DEFAULT_NOTIFICATION_PREFS = {
	emailNotifications: true,
	browserNotifications: true,
	interviewUpdates: true,
	atsUpdates: true,
	roadmapUpdates: true,
	marketingEmails: false,
	newsletter: true,
}

export const DEFAULT_PRIVACY_PREFS = {
	publicProfile: true,
	resumeVisibility: 'connections',
	analyticsSharing: true,
	searchVisibility: true,
}

export const DEFAULT_APPEARANCE_PREFS = {
	reducedMotion: false,
	fontSize: 'default',
}

export const DUMMY_SESSIONS = [
	{
		id: 'session_1',
		browser: 'Chrome',
		os: 'Windows 11',
		location: 'Mumbai, India',
		lastActive: 'Active now',
		isCurrent: true,
	},
	{
		id: 'session_2',
		browser: 'Safari',
		os: 'macOS Sonoma',
		location: 'Mumbai, India',
		lastActive: '1 day ago',
		isCurrent: false,
	},
	{
		id: 'session_3',
		browser: 'Firefox',
		os: 'Ubuntu 24.04',
		location: 'Pune, India',
		lastActive: '3 days ago',
		isCurrent: false,
	},
]

export const GENDER_OPTIONS = [
	{ value: '', label: 'Select gender' },
	{ value: 'male', label: 'Male' },
	{ value: 'female', label: 'Female' },
	{ value: 'non-binary', label: 'Non-binary' },
	{ value: 'prefer-not', label: 'Prefer not to say' },
]

export const EXPERIENCE_LEVELS = [
	{ value: '', label: 'Select level' },
	{ value: 'entry', label: 'Entry Level (0–2 years)' },
	{ value: 'mid', label: 'Mid Level (2–5 years)' },
	{ value: 'senior', label: 'Senior (5+ years)' },
	{ value: 'lead', label: 'Lead / Principal' },
]

export const EDUCATION_LEVELS = [
	{ value: '', label: 'Select education' },
	{ value: 'high-school', label: 'High School' },
	{ value: 'diploma', label: 'Diploma' },
	{ value: 'bachelors', label: "Bachelor's Degree" },
	{ value: 'masters', label: "Master's Degree" },
	{ value: 'phd', label: 'PhD' },
]

export const EMPLOYMENT_TYPES = [
	{ value: '', label: 'Select type' },
	{ value: 'full-time', label: 'Full-time' },
	{ value: 'part-time', label: 'Part-time' },
	{ value: 'contract', label: 'Contract' },
	{ value: 'internship', label: 'Internship' },
	{ value: 'freelance', label: 'Freelance' },
]

export const RESUME_VISIBILITY_OPTIONS = [
	{ value: 'public', label: 'Public — anyone can view' },
	{ value: 'connections', label: 'Connections only' },
	{ value: 'private', label: 'Private — only you' },
]
