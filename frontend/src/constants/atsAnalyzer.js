import { z } from 'zod'

/* ─────────────────────────────────────────────────────────────────
   ATS Analyzer — Constants & Configuration
   ───────────────────────────────────────────────────────────────── */

export const ATS_STORAGE_KEY = 'aca_ats_data'

/* ─── File validation ───────────────────────────────────────────── */

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ACCEPTED_TYPES = [
	'application/pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const ACCEPTED_EXTENSIONS = ['PDF', 'DOCX']

export const fileValidationSchema = z.object({
	file: z
		.instanceof(File, { message: 'Please upload a file' })
		.refine((f) => ACCEPTED_TYPES.includes(f.type), {
			message: 'Only PDF and DOCX files are supported',
		})
		.refine((f) => f.size <= MAX_FILE_SIZE, {
			message: 'File size must be under 5 MB',
		}),
})

/* ─── Score thresholds ──────────────────────────────────────────── */

export const SCORE_TIERS = [
	{ min: 85, label: 'Excellent', color: 'emerald', description: 'Your resume is highly compatible with Applicant Tracking Systems.' },
	{ min: 70, label: 'Good', color: 'blue', description: 'Your resume passes most ATS checks with minor improvements needed.' },
	{ min: 50, label: 'Average', color: 'amber', description: 'Your resume needs several improvements to pass ATS screening.' },
	{ min: 0, label: 'Poor', color: 'red', description: 'Your resume has critical issues that may cause ATS rejection.' },
]

export function getScoreTier(score) {
	return SCORE_TIERS.find((t) => score >= t.min) ?? SCORE_TIERS[SCORE_TIERS.length - 1]
}

/* ─── Loading step messages ─────────────────────────────────────── */

export const LOADING_STEPS = [
	'Scanning Resume…',
	'Extracting Keywords…',
	'Calculating ATS Score…',
	'Preparing Suggestions…',
]

/* ─── Dummy analysis result ─────────────────────────────────────── */

export const DUMMY_ANALYSIS = {
	overallScore: 92,

	scoreBreakdown: [
		{ id: 'format', label: 'Format Score', score: 95, icon: 'FileCheck', explanation: 'Clean single-column layout with standard fonts' },
		{ id: 'keywords', label: 'Keyword Score', score: 88, icon: 'Search', explanation: 'Good keyword density, some missing terms' },
		{ id: 'readability', label: 'Readability', score: 91, icon: 'BookOpen', explanation: 'Clear and concise language throughout' },
		{ id: 'sections', label: 'Section Completeness', score: 96, icon: 'LayoutList', explanation: 'All essential sections are present' },
		{ id: 'grammar', label: 'Grammar', score: 94, icon: 'SpellCheck', explanation: 'Minimal grammatical errors detected' },
		{ id: 'contact', label: 'Contact Information', score: 100, icon: 'Contact', explanation: 'Complete contact details provided' },
		{ id: 'experience', label: 'Experience', score: 87, icon: 'Briefcase', explanation: 'Strong experience with room for quantification' },
		{ id: 'education', label: 'Education', score: 90, icon: 'GraduationCap', explanation: 'Education section is well-structured' },
		{ id: 'skills', label: 'Skills & Projects', score: 85, icon: 'Code', explanation: 'Good technical skills, add more cloud technologies' },
	],

	matchedKeywords: [
		'React', 'TypeScript', 'Node.js', 'JavaScript', 'REST API',
		'Git', 'Agile', 'CSS', 'HTML', 'MongoDB', 'Express',
		'Problem Solving', 'Team Collaboration',
	],

	missingKeywords: [
		'CI/CD', 'Docker', 'Kubernetes', 'AWS',
		'Microservices', 'GraphQL', 'Testing',
	],

	suggestedKeywords: [
		'Cloud Computing', 'DevOps', 'System Design',
		'Performance Optimization', 'Code Review', 'Mentoring',
	],

	issues: [
		{ id: 'iss-1', text: 'Missing measurable achievements in experience section', severity: 'high' },
		{ id: 'iss-2', text: 'Weak action verbs in project descriptions', severity: 'high' },
		{ id: 'iss-3', text: 'No GitHub profile link provided', severity: 'medium' },
		{ id: 'iss-4', text: 'No LinkedIn profile link found', severity: 'medium' },
		{ id: 'iss-5', text: 'Large paragraphs detected — use bullet points', severity: 'medium' },
		{ id: 'iss-6', text: 'Complex formatting may confuse ATS parsers', severity: 'low' },
		{ id: 'iss-7', text: 'Tables detected in layout', severity: 'low' },
		{ id: 'iss-8', text: 'Headers not optimized for ATS scanning', severity: 'low' },
	],

	suggestions: [
		{ id: 'sug-1', original: 'Worked on', replacement: 'Developed', context: 'Use strong action verbs to demonstrate impact' },
		{ id: 'sug-2', original: 'Responsible for', replacement: 'Led and delivered', context: 'Show leadership and ownership' },
		{ id: 'sug-3', original: null, replacement: 'Increase quantified achievements', context: 'Add metrics like "improved performance by 40%"' },
		{ id: 'sug-4', original: null, replacement: 'Reduce paragraph length', context: 'Keep bullet points under 2 lines for readability' },
		{ id: 'sug-5', original: null, replacement: 'Add cloud technologies', context: 'Include AWS, Docker, or Kubernetes skills' },
		{ id: 'sug-6', original: null, replacement: 'Improve professional summary', context: 'Lead with years of experience and key specializations' },
		{ id: 'sug-7', original: null, replacement: 'Optimize project section', context: 'Include tech stack, impact metrics, and live links' },
	],

	compatibility: {
		compatible: 8,
		needsImprovement: 4,
		critical: 2,
	},

	skillsCoverage: [
		{ name: 'React', current: 92, recommended: 95 },
		{ name: 'TypeScript', current: 78, recommended: 90 },
		{ name: 'Node.js', current: 85, recommended: 88 },
		{ name: 'MongoDB', current: 70, recommended: 80 },
		{ name: 'Express', current: 82, recommended: 85 },
		{ name: 'Docker', current: 30, recommended: 75 },
		{ name: 'AWS', current: 25, recommended: 70 },
	],

	checklist: [
		{ id: 'chk-1', label: 'Contact Information', passed: true },
		{ id: 'chk-2', label: 'Skills Section', passed: true },
		{ id: 'chk-3', label: 'Education', passed: true },
		{ id: 'chk-4', label: 'Experience', passed: true },
		{ id: 'chk-5', label: 'ATS Friendly Fonts', passed: true },
		{ id: 'chk-6', label: 'One Column Layout', passed: true },
		{ id: 'chk-7', label: 'Dates Format', passed: true },
		{ id: 'chk-8', label: 'Portfolio Link', passed: false },
		{ id: 'chk-9', label: 'GitHub Profile', passed: false },
		{ id: 'chk-10', label: 'Certifications', passed: false },
	],

	insights: {
		wordCount: 847,
		pageCount: 2,
		readingTime: '3 min',
		avgSentenceLength: 14,
		keywordDensity: '6.2%',
		passiveVoice: '8%',
		numbersUsed: 12,
		actionVerbs: 24,
	},

	timeline: [
		{ id: 'tl-1', label: 'Fix Formatting Issues', priority: 'high', status: 'pending' },
		{ id: 'tl-2', label: 'Add Missing Keywords', priority: 'high', status: 'pending' },
		{ id: 'tl-3', label: 'Improve Experience Section', priority: 'medium', status: 'pending' },
		{ id: 'tl-4', label: 'Optimize Project Descriptions', priority: 'medium', status: 'pending' },
		{ id: 'tl-5', label: 'Rewrite Professional Summary', priority: 'low', status: 'pending' },
	],
}

/* ─── Dummy analysis history ────────────────────────────────────── */

export const DUMMY_HISTORY = [
	{ id: 'h-1', fileName: 'Full_Stack_Developer_Resume.pdf', date: '2026-07-12', score: 92, status: 'completed' },
	{ id: 'h-2', fileName: 'Frontend_Engineer_v2.pdf', date: '2026-07-08', score: 78, status: 'completed' },
	{ id: 'h-3', fileName: 'Software_Engineer_Draft.docx', date: '2026-07-01', score: 65, status: 'completed' },
]

/* ─── Dummy resume preview HTML ─────────────────────────────────── */

export const DUMMY_RESUME_HTML = `
<div style="font-family: Helvetica, Arial, sans-serif; line-height: 1.6; padding: 2px 0;">
  <h2 style="margin: 0 0 4px; font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Krunal Rathod</h2>
  <p style="margin: 0 0 12px; font-size: 12px; color: #64748B;">Full Stack Developer · krunal@email.com · +91 98765 43210 · Mumbai, India</p>

  <h3 style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1.5px solid #2563EB; padding-bottom: 3px; margin: 14px 0 8px; color: #2563EB;">Professional Summary</h3>
  <p style="font-size: 12px; margin: 0 0 10px; color: #334155;">Full Stack Developer with 2+ years of experience building scalable web applications using React, Node.js, and MongoDB. Passionate about clean code, performance optimization, and delivering exceptional user experiences.</p>

  <h3 style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1.5px solid #2563EB; padding-bottom: 3px; margin: 14px 0 8px; color: #2563EB;">Experience</h3>
  <div style="margin-bottom: 10px;">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <strong style="font-size: 13px;">Software Developer</strong>
      <span style="font-size: 11px; color: #64748B;">Jan 2025 – Present</span>
    </div>
    <p style="font-size: 12px; color: #64748B; margin: 1px 0 4px;">TechCorp Solutions · Mumbai</p>
    <ul style="margin: 0; padding-left: 16px; font-size: 12px; color: #334155;">
      <li>Developed 5 production React applications serving 10K+ users</li>
      <li>Built RESTful APIs with Node.js and Express, reducing response time by 40%</li>
      <li>Implemented CI/CD pipelines and automated testing workflows</li>
    </ul>
  </div>

  <h3 style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1.5px solid #2563EB; padding-bottom: 3px; margin: 14px 0 8px; color: #2563EB;">Education</h3>
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <strong style="font-size: 13px;">B.Tech Computer Science</strong>
    <span style="font-size: 11px; color: #64748B;">2022 – 2026</span>
  </div>
  <p style="font-size: 12px; color: #64748B; margin: 1px 0 10px;">Mumbai University · CGPA: 8.5</p>

  <h3 style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1.5px solid #2563EB; padding-bottom: 3px; margin: 14px 0 8px; color: #2563EB;">Skills</h3>
  <p style="font-size: 12px; color: #334155; margin: 0;">React · TypeScript · Node.js · Express · MongoDB · Git · REST APIs · Tailwind CSS · Docker · AWS</p>
</div>
`

/* ─── Severity config ───────────────────────────────────────────── */

export const SEVERITY_CONFIG = {
	high: { label: 'High', bgClass: 'bg-red-500/10', textClass: 'text-red-500', borderClass: 'border-red-500/20' },
	medium: { label: 'Medium', bgClass: 'bg-amber-500/10', textClass: 'text-amber-500', borderClass: 'border-amber-500/20' },
	low: { label: 'Low', bgClass: 'bg-blue-500/10', textClass: 'text-blue-500', borderClass: 'border-blue-500/20' },
}

/* ─── Priority config ───────────────────────────────────────────── */

export const PRIORITY_CONFIG = {
	high: { label: 'High', dotClass: 'bg-red-500', bgClass: 'bg-red-500/10', textClass: 'text-red-500' },
	medium: { label: 'Medium', dotClass: 'bg-amber-500', bgClass: 'bg-amber-500/10', textClass: 'text-amber-500' },
	low: { label: 'Low', dotClass: 'bg-blue-500', bgClass: 'bg-blue-500/10', textClass: 'text-blue-500' },
}

/* ─── Insight definitions ───────────────────────────────────────── */

export const INSIGHT_DEFINITIONS = [
	{ key: 'wordCount', label: 'Word Count', icon: 'Type', format: (v) => String(v) },
	{ key: 'pageCount', label: 'Pages', icon: 'FileText', format: (v) => String(v) },
	{ key: 'readingTime', label: 'Reading Time', icon: 'Clock', format: (v) => v },
	{ key: 'avgSentenceLength', label: 'Avg. Sentence', icon: 'AlignLeft', format: (v) => `${v} words` },
	{ key: 'keywordDensity', label: 'Keyword Density', icon: 'Target', format: (v) => v },
	{ key: 'passiveVoice', label: 'Passive Voice', icon: 'MessageCircle', format: (v) => v },
	{ key: 'numbersUsed', label: 'Numbers Used', icon: 'Hash', format: (v) => String(v) },
	{ key: 'actionVerbs', label: 'Action Verbs', icon: 'Zap', format: (v) => String(v) },
]
