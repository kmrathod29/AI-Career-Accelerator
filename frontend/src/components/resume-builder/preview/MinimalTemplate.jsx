/**
 * MinimalTemplate — maximum whitespace, understated, single column.
 */
export function MinimalTemplate({ data }) {
	const { personalInfo, summary, experiences, education, skills, projects, certifications, achievements, languages, customSections } = data

	return (
		<div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: '9px', lineHeight: 1.6, color: '#1a1a1a', background: '#fff', padding: '28px 24px' }}>
			{/* Header — centered, minimal */}
			<div style={{ textAlign: 'center', marginBottom: '18px' }}>
				<h1 style={{ fontSize: '17px', fontWeight: 300, color: '#0f172a', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
					{personalInfo.name || 'Your Name'}
				</h1>
				{personalInfo.headline && (
					<p style={{ fontSize: '9.5px', color: '#64748b', marginTop: '3px', fontWeight: 400, letterSpacing: '0.02em' }}>
						{personalInfo.headline}
					</p>
				)}
				<div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px', marginTop: '6px', fontSize: '8px', color: '#94a3b8' }}>
					{personalInfo.email && <span>{personalInfo.email}</span>}
					{personalInfo.phone && <span>|</span>}
					{personalInfo.phone && <span>{personalInfo.phone}</span>}
					{personalInfo.location && <span>|</span>}
					{personalInfo.location && <span>{personalInfo.location}</span>}
				</div>
			</div>

			<hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0 0 14px 0' }} />

			{summary && (
				<div style={{ marginBottom: '14px' }}>
					<p style={{ color: '#374151', lineHeight: 1.7 }}>{summary}</p>
				</div>
			)}

			{experiences.length > 0 && (
				<div style={{ marginBottom: '14px' }}>
					<h2 style={{ fontSize: '9px', fontWeight: 600, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px' }}>Experience</h2>
					{experiences.map((exp) => (
						<div key={exp.id} style={{ marginBottom: '8px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ fontWeight: 600, fontSize: '9px', color: '#0f172a' }}>{exp.company} — {exp.role}</span>
								<span style={{ fontSize: '8px', color: '#94a3b8' }}>{exp.startDate && formatDate(exp.startDate)} — {exp.currentlyWorking ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}</span>
							</div>
							{exp.description && <p style={{ color: '#64748b', marginTop: '2px' }}>{exp.description}</p>}
						</div>
					))}
				</div>
			)}

			{education.length > 0 && (
				<div style={{ marginBottom: '14px' }}>
					<h2 style={{ fontSize: '9px', fontWeight: 600, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px' }}>Education</h2>
					{education.map((edu) => (
						<div key={edu.id} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
							<div>
								<span style={{ fontWeight: 600, fontSize: '9px' }}>{edu.degree}{edu.branch ? `, ${edu.branch}` : ''}</span>
								<p style={{ fontSize: '8.5px', color: '#64748b' }}>{edu.college}{edu.cgpa ? ` — ${edu.cgpa}` : ''}</p>
							</div>
							<span style={{ fontSize: '8px', color: '#94a3b8' }}>{edu.passingYear}</span>
						</div>
					))}
				</div>
			)}

			{skills.length > 0 && (
				<div style={{ marginBottom: '14px' }}>
					<h2 style={{ fontSize: '9px', fontWeight: 600, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px' }}>Skills</h2>
					<p style={{ color: '#374151', fontSize: '8.5px' }}>{skills.join('  ·  ')}</p>
				</div>
			)}

			{projects.length > 0 && (
				<div style={{ marginBottom: '14px' }}>
					<h2 style={{ fontSize: '9px', fontWeight: 600, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px' }}>Projects</h2>
					{projects.map((proj) => (
						<div key={proj.id} style={{ marginBottom: '6px' }}>
							<span style={{ fontWeight: 600, fontSize: '9px' }}>{proj.name}</span>
							{proj.techStack && <span style={{ fontSize: '8px', color: '#94a3b8' }}> — {proj.techStack}</span>}
							{proj.description && <p style={{ color: '#64748b', marginTop: '1px' }}>{proj.description}</p>}
						</div>
					))}
				</div>
			)}

			{certifications.length > 0 && (
				<div style={{ marginBottom: '14px' }}>
					<h2 style={{ fontSize: '9px', fontWeight: 600, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px' }}>Certifications</h2>
					{certifications.map((c) => (
						<p key={c.id} style={{ marginBottom: '2px', color: '#374151' }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</p>
					))}
				</div>
			)}

			{achievements.length > 0 && (
				<div style={{ marginBottom: '14px' }}>
					<h2 style={{ fontSize: '9px', fontWeight: 600, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px' }}>Achievements</h2>
					{achievements.map((a) => a.text && <p key={a.id} style={{ marginBottom: '2px', color: '#374151' }}>• {a.text}</p>)}
				</div>
			)}

			{languages.length > 0 && (
				<div style={{ marginBottom: '14px' }}>
					<h2 style={{ fontSize: '9px', fontWeight: 600, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px' }}>Languages</h2>
					<p style={{ color: '#374151', fontSize: '8.5px' }}>{languages.map((l) => `${l.language} (${l.proficiency})`).join('  ·  ')}</p>
				</div>
			)}

			{customSections.map((cs) => cs.title && (
				<div key={cs.id} style={{ marginBottom: '14px' }}>
					<h2 style={{ fontSize: '9px', fontWeight: 600, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px' }}>{cs.title}</h2>
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
