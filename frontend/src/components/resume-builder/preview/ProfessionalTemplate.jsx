/**
 * ProfessionalTemplate — traditional layout, serif headings, clear structure.
 */
export function ProfessionalTemplate({ data }) {
	const { personalInfo, summary, experiences, education, skills, projects, certifications, achievements, languages, customSections } = data

	const sectionHeading = { fontSize: '10px', fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #334155', paddingBottom: '3px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }

	return (
		<div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '9px', lineHeight: 1.55, color: '#1e293b', background: '#fff', padding: '24px 20px' }}>
			{/* Header */}
			<div style={{ textAlign: 'center', marginBottom: '14px' }}>
				<h1 style={{ fontSize: '19px', fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: "Georgia, serif" }}>
					{personalInfo.name || 'Your Name'}
				</h1>
				{personalInfo.headline && (
					<p style={{ fontSize: '10px', color: '#475569', marginTop: '2px', fontStyle: 'italic' }}>{personalInfo.headline}</p>
				)}
				<div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px', marginTop: '5px', fontSize: '8px', color: '#64748b', fontFamily: "'Helvetica Neue', sans-serif" }}>
					{personalInfo.email && <span>{personalInfo.email}</span>}
					{personalInfo.phone && <span>| {personalInfo.phone}</span>}
					{personalInfo.location && <span>| {personalInfo.location}</span>}
				</div>
			</div>

			{summary && (
				<div style={{ marginBottom: '12px' }}>
					<h2 style={sectionHeading}>Professional Summary</h2>
					<p style={{ color: '#334155' }}>{summary}</p>
				</div>
			)}

			{experiences.length > 0 && (
				<div style={{ marginBottom: '12px' }}>
					<h2 style={sectionHeading}>Professional Experience</h2>
					{experiences.map((exp) => (
						<div key={exp.id} style={{ marginBottom: '8px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<div>
									<strong style={{ fontSize: '9.5px' }}>{exp.role}</strong>
									<span style={{ color: '#64748b' }}> at {exp.company}</span>
								</div>
								<span style={{ fontSize: '8px', color: '#94a3b8', fontFamily: 'sans-serif' }}>{exp.startDate && formatDate(exp.startDate)} — {exp.currentlyWorking ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}</span>
							</div>
							{exp.description && <p style={{ color: '#475569', marginTop: '2px' }}>{exp.description}</p>}
						</div>
					))}
				</div>
			)}

			{education.length > 0 && (
				<div style={{ marginBottom: '12px' }}>
					<h2 style={sectionHeading}>Education</h2>
					{education.map((edu) => (
						<div key={edu.id} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
							<div>
								<strong style={{ fontSize: '9.5px' }}>{edu.degree}{edu.branch ? ` in ${edu.branch}` : ''}</strong>
								<p style={{ fontSize: '8.5px', color: '#64748b' }}>{edu.college}{edu.cgpa ? ` — CGPA: ${edu.cgpa}` : ''}</p>
							</div>
							<span style={{ fontSize: '8px', color: '#94a3b8', fontFamily: 'sans-serif' }}>{edu.passingYear}</span>
						</div>
					))}
				</div>
			)}

			{skills.length > 0 && (
				<div style={{ marginBottom: '12px' }}>
					<h2 style={sectionHeading}>Technical Skills</h2>
					<p style={{ color: '#334155', fontFamily: 'sans-serif', fontSize: '8.5px' }}>{skills.join(', ')}</p>
				</div>
			)}

			{projects.length > 0 && (
				<div style={{ marginBottom: '12px' }}>
					<h2 style={sectionHeading}>Projects</h2>
					{projects.map((proj) => (
						<div key={proj.id} style={{ marginBottom: '6px' }}>
							<strong style={{ fontSize: '9px' }}>{proj.name}</strong>
							{proj.techStack && <span style={{ fontSize: '8px', color: '#64748b', fontFamily: 'sans-serif' }}> ({proj.techStack})</span>}
							{proj.description && <p style={{ color: '#475569', marginTop: '1px' }}>{proj.description}</p>}
						</div>
					))}
				</div>
			)}

			{certifications.length > 0 && (
				<div style={{ marginBottom: '12px' }}>
					<h2 style={sectionHeading}>Certifications</h2>
					{certifications.map((c) => <p key={c.id} style={{ marginBottom: '2px' }}>{c.name}{c.issuer ? `, ${c.issuer}` : ''}</p>)}
				</div>
			)}

			{achievements.length > 0 && (
				<div style={{ marginBottom: '12px' }}>
					<h2 style={sectionHeading}>Achievements</h2>
					{achievements.map((a) => a.text && <p key={a.id} style={{ marginBottom: '2px' }}>• {a.text}</p>)}
				</div>
			)}

			{languages.length > 0 && (
				<div style={{ marginBottom: '12px' }}>
					<h2 style={sectionHeading}>Languages</h2>
					<p style={{ fontSize: '8.5px' }}>{languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}</p>
				</div>
			)}

			{customSections.map((cs) => cs.title && (
				<div key={cs.id} style={{ marginBottom: '12px' }}>
					<h2 style={sectionHeading}>{cs.title}</h2>
					<p>{cs.content}</p>
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
