/**
 * ExecutiveTemplate — bold headers, dark header banner, formal styling.
 */
export function ExecutiveTemplate({ data }) {
	const { personalInfo, summary, experiences, education, skills, projects, certifications, achievements, languages, customSections } = data

	return (
		<div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: '9px', lineHeight: 1.55, color: '#1e293b', background: '#fff' }}>
			{/* Dark header banner */}
			<div style={{ background: '#0f172a', color: '#fff', padding: '20px 20px 16px', marginBottom: '14px' }}>
				<h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0, letterSpacing: '0.03em' }}>
					{personalInfo.name || 'Your Name'}
				</h1>
				{personalInfo.headline && (
					<p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px', fontWeight: 400, letterSpacing: '0.02em' }}>{personalInfo.headline}</p>
				)}
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px', fontSize: '8px', color: '#cbd5e1' }}>
					{personalInfo.email && <span>{personalInfo.email}</span>}
					{personalInfo.phone && <span>• {personalInfo.phone}</span>}
					{personalInfo.location && <span>• {personalInfo.location}</span>}
				</div>
			</div>

			<div style={{ padding: '0 20px 20px' }}>
				{summary && (
					<div style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a', borderLeft: '3px solid #0f172a', paddingLeft: '8px', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Executive Summary</h2>
						<p style={{ color: '#334155', paddingLeft: '11px' }}>{summary}</p>
					</div>
				)}

				{experiences.length > 0 && (
					<div style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a', borderLeft: '3px solid #0f172a', paddingLeft: '8px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Experience</h2>
						{experiences.map((exp) => (
							<div key={exp.id} style={{ marginBottom: '8px', paddingLeft: '11px' }}>
								<strong style={{ fontSize: '9.5px', color: '#0f172a' }}>{exp.role}</strong>
								<p style={{ fontSize: '8.5px', color: '#475569', fontWeight: 500 }}>{exp.company} | {exp.startDate && formatDate(exp.startDate)} — {exp.currentlyWorking ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}</p>
								{exp.description && <p style={{ color: '#475569', marginTop: '2px' }}>{exp.description}</p>}
							</div>
						))}
					</div>
				)}

				{education.length > 0 && (
					<div style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a', borderLeft: '3px solid #0f172a', paddingLeft: '8px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Education</h2>
						{education.map((edu) => (
							<div key={edu.id} style={{ marginBottom: '5px', paddingLeft: '11px' }}>
								<strong style={{ fontSize: '9.5px' }}>{edu.degree}{edu.branch ? ` — ${edu.branch}` : ''}</strong>
								<p style={{ fontSize: '8.5px', color: '#64748b' }}>{edu.college} | {edu.passingYear}{edu.cgpa ? ` | CGPA: ${edu.cgpa}` : ''}</p>
							</div>
						))}
					</div>
				)}

				{skills.length > 0 && (
					<div style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a', borderLeft: '3px solid #0f172a', paddingLeft: '8px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Core Competencies</h2>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', paddingLeft: '11px' }}>
							{skills.map((s) => (
								<span key={s} style={{ background: '#0f172a', color: '#fff', padding: '1px 6px', borderRadius: '3px', fontSize: '7.5px', fontWeight: 500 }}>{s}</span>
							))}
						</div>
					</div>
				)}

				{projects.length > 0 && (
					<div style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a', borderLeft: '3px solid #0f172a', paddingLeft: '8px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Key Projects</h2>
						{projects.map((p) => (
							<div key={p.id} style={{ marginBottom: '5px', paddingLeft: '11px' }}>
								<strong style={{ fontSize: '9px' }}>{p.name}</strong>
								{p.techStack && <span style={{ fontSize: '8px', color: '#64748b' }}> — {p.techStack}</span>}
								{p.description && <p style={{ color: '#475569', marginTop: '1px' }}>{p.description}</p>}
							</div>
						))}
					</div>
				)}

				{certifications.length > 0 && (
					<div style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a', borderLeft: '3px solid #0f172a', paddingLeft: '8px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Certifications</h2>
						{certifications.map((c) => <p key={c.id} style={{ marginBottom: '2px', paddingLeft: '11px' }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</p>)}
					</div>
				)}

				{achievements.length > 0 && (
					<div style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a', borderLeft: '3px solid #0f172a', paddingLeft: '8px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Achievements</h2>
						{achievements.map((a) => a.text && <p key={a.id} style={{ marginBottom: '2px', paddingLeft: '11px' }}>■ {a.text}</p>)}
					</div>
				)}

				{languages.length > 0 && (
					<div style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a', borderLeft: '3px solid #0f172a', paddingLeft: '8px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Languages</h2>
						<p style={{ paddingLeft: '11px', fontSize: '8.5px' }}>{languages.map((l) => `${l.language} (${l.proficiency})`).join('  |  ')}</p>
					</div>
				)}

				{customSections.map((cs) => cs.title && (
					<div key={cs.id} style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a', borderLeft: '3px solid #0f172a', paddingLeft: '8px', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cs.title}</h2>
						<p style={{ paddingLeft: '11px' }}>{cs.content}</p>
					</div>
				))}
			</div>
		</div>
	)
}

function formatDate(dateStr) {
	if (!dateStr) return ''
	const [year, month] = dateStr.split('-')
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	return `${months[parseInt(month, 10) - 1] || ''} ${year}`
}
