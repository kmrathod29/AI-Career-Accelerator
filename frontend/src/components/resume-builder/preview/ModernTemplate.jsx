/**
 * ModernTemplate — clean layout with blue accents, two-column header.
 * Always renders in light/print mode regardless of dashboard theme.
 */
export function ModernTemplate({ data }) {
	const { personalInfo, summary, experiences, education, skills, projects, certifications, achievements, languages, socialLinks, customSections } = data

	return (
		<div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: '9px', lineHeight: 1.5, color: '#1a1a1a', background: '#fff', padding: '24px 20px' }}>
			{/* Header */}
			<div style={{ borderBottom: '2px solid #2563EB', paddingBottom: '12px', marginBottom: '14px' }}>
				<h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
					{personalInfo.name || 'Your Name'}
				</h1>
				{personalInfo.headline && (
					<p style={{ fontSize: '10px', color: '#2563EB', marginTop: '2px', fontWeight: 500 }}>
						{personalInfo.headline}
					</p>
				)}
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px', fontSize: '8px', color: '#64748b' }}>
					{personalInfo.email && <span>{personalInfo.email}</span>}
					{personalInfo.phone && <span>• {personalInfo.phone}</span>}
					{personalInfo.location && <span>• {personalInfo.location}</span>}
					{personalInfo.website && <span>• {personalInfo.website}</span>}
				</div>
			</div>

			{/* Summary */}
			{summary && (
				<div style={{ marginBottom: '12px' }}>
					<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Summary</h2>
					<p style={{ color: '#374151', lineHeight: 1.6 }}>{summary}</p>
				</div>
			)}

			{/* Experience */}
			{experiences.length > 0 && (
				<div style={{ marginBottom: '12px' }}>
					<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Experience</h2>
					{experiences.map((exp) => (
						<div key={exp.id} style={{ marginBottom: '8px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
								<strong style={{ fontSize: '9.5px', color: '#0f172a' }}>{exp.role || 'Role'}</strong>
								<span style={{ fontSize: '8px', color: '#94a3b8' }}>
									{exp.startDate && formatDate(exp.startDate)} — {exp.currentlyWorking ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}
								</span>
							</div>
							<p style={{ fontSize: '8.5px', color: '#2563EB', fontWeight: 500 }}>{exp.company || 'Company'}</p>
							{exp.description && <p style={{ color: '#374151', marginTop: '2px' }}>{exp.description}</p>}
						</div>
					))}
				</div>
			)}

			{/* Education */}
			{education.length > 0 && (
				<div style={{ marginBottom: '12px' }}>
					<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Education</h2>
					{education.map((edu) => (
						<div key={edu.id} style={{ marginBottom: '6px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
								<strong style={{ fontSize: '9.5px', color: '#0f172a' }}>{edu.degree || 'Degree'}{edu.branch ? ` — ${edu.branch}` : ''}</strong>
								<span style={{ fontSize: '8px', color: '#94a3b8' }}>{edu.passingYear}</span>
							</div>
							<p style={{ fontSize: '8.5px', color: '#64748b' }}>{edu.college || 'University'}{edu.cgpa ? ` | CGPA: ${edu.cgpa}` : ''}</p>
						</div>
					))}
				</div>
			)}

			{/* Skills */}
			{skills.length > 0 && (
				<div style={{ marginBottom: '12px' }}>
					<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Skills</h2>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
						{skills.map((skill) => (
							<span key={skill} style={{ background: '#eff6ff', color: '#2563EB', padding: '1px 6px', borderRadius: '4px', fontSize: '8px', fontWeight: 500 }}>
								{skill}
							</span>
						))}
					</div>
				</div>
			)}

			{/* Projects */}
			{projects.length > 0 && (
				<div style={{ marginBottom: '12px' }}>
					<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Projects</h2>
					{projects.map((proj) => (
						<div key={proj.id} style={{ marginBottom: '6px' }}>
							<strong style={{ fontSize: '9.5px', color: '#0f172a' }}>{proj.name || 'Project'}</strong>
							{proj.techStack && <span style={{ fontSize: '8px', color: '#64748b' }}> — {proj.techStack}</span>}
							{proj.description && <p style={{ color: '#374151', marginTop: '1px' }}>{proj.description}</p>}
						</div>
					))}
				</div>
			)}

			{/* Certifications */}
			{certifications.length > 0 && (
				<div style={{ marginBottom: '12px' }}>
					<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Certifications</h2>
					{certifications.map((cert) => (
						<div key={cert.id} style={{ marginBottom: '4px' }}>
							<strong style={{ fontSize: '9px', color: '#0f172a' }}>{cert.name}</strong>
							{cert.issuer && <span style={{ fontSize: '8px', color: '#64748b' }}> — {cert.issuer}</span>}
						</div>
					))}
				</div>
			)}

			{/* Achievements */}
			{achievements.length > 0 && (
				<div style={{ marginBottom: '12px' }}>
					<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Achievements</h2>
					{achievements.map((ach) => ach.text && (
						<p key={ach.id} style={{ marginBottom: '2px', color: '#374151' }}>• {ach.text}</p>
					))}
				</div>
			)}

			{/* Languages */}
			{languages.length > 0 && (
				<div style={{ marginBottom: '12px' }}>
					<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Languages</h2>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
						{languages.map((lang) => (
							<span key={lang.id} style={{ fontSize: '8.5px', color: '#374151' }}>
								{lang.language}{lang.proficiency ? ` (${lang.proficiency})` : ''}
							</span>
						))}
					</div>
				</div>
			)}

			{/* Custom sections */}
			{customSections.map((cs) => cs.title && (
				<div key={cs.id} style={{ marginBottom: '12px' }}>
					<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{cs.title}</h2>
					<p style={{ color: '#374151' }}>{cs.content}</p>
				</div>
			))}
		</div>
	)
}

function formatDate(dateStr) {
	if (!dateStr) return ''
	const [year, month] = dateStr.split('-')
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	return `${months[parseInt(month, 10) - 1] || ''} ${year}`
}
