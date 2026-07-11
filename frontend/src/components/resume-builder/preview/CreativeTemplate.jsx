/**
 * CreativeTemplate — colorful accents, gradient header, modern styling.
 */
export function CreativeTemplate({ data }) {
	const { personalInfo, summary, experiences, education, skills, projects, certifications, achievements, languages, customSections } = data

	const accent = '#7c3aed'
	const accentLight = '#f5f3ff'

	return (
		<div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: '9px', lineHeight: 1.55, color: '#1e293b', background: '#fff' }}>
			{/* Gradient header */}
			<div style={{ background: `linear-gradient(135deg, ${accent}, #2563eb)`, color: '#fff', padding: '20px 20px 16px', marginBottom: '14px', borderRadius: '0 0 12px 12px' }}>
				<h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
					{personalInfo.name || 'Your Name'}
				</h1>
				{personalInfo.headline && (
					<p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', marginTop: '3px' }}>{personalInfo.headline}</p>
				)}
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px', fontSize: '8px', color: 'rgba(255,255,255,0.7)' }}>
					{personalInfo.email && <span>{personalInfo.email}</span>}
					{personalInfo.phone && <span>• {personalInfo.phone}</span>}
					{personalInfo.location && <span>• {personalInfo.location}</span>}
				</div>
			</div>

			<div style={{ padding: '0 20px 20px' }}>
				{summary && (
					<div style={{ marginBottom: '14px', background: accentLight, borderRadius: '8px', padding: '10px 12px', borderLeft: `3px solid ${accent}` }}>
						<p style={{ color: '#334155', lineHeight: 1.7 }}>{summary}</p>
					</div>
				)}

				{experiences.length > 0 && (
					<div style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: accent, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
							<span style={{ display: 'inline-block', width: '14px', height: '2px', background: accent, borderRadius: '1px' }} />
							EXPERIENCE
						</h2>
						{experiences.map((exp) => (
							<div key={exp.id} style={{ marginBottom: '8px', paddingLeft: '20px', borderLeft: '2px solid #e2e8f0', position: 'relative' }}>
								<div style={{ position: 'absolute', left: '-4px', top: '2px', width: '6px', height: '6px', borderRadius: '50%', background: accent }} />
								<strong style={{ fontSize: '9.5px', color: '#0f172a' }}>{exp.role}</strong>
								<p style={{ fontSize: '8.5px', color: accent, fontWeight: 500 }}>{exp.company} | {exp.startDate && formatDate(exp.startDate)} — {exp.currentlyWorking ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}</p>
								{exp.description && <p style={{ color: '#475569', marginTop: '2px' }}>{exp.description}</p>}
							</div>
						))}
					</div>
				)}

				{education.length > 0 && (
					<div style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: accent, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
							<span style={{ display: 'inline-block', width: '14px', height: '2px', background: accent, borderRadius: '1px' }} />
							EDUCATION
						</h2>
						{education.map((edu) => (
							<div key={edu.id} style={{ marginBottom: '5px' }}>
								<strong style={{ fontSize: '9.5px' }}>{edu.degree}{edu.branch ? ` — ${edu.branch}` : ''}</strong>
								<p style={{ fontSize: '8.5px', color: '#64748b' }}>{edu.college} | {edu.passingYear}{edu.cgpa ? ` | CGPA: ${edu.cgpa}` : ''}</p>
							</div>
						))}
					</div>
				)}

				{skills.length > 0 && (
					<div style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: accent, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
							<span style={{ display: 'inline-block', width: '14px', height: '2px', background: accent, borderRadius: '1px' }} />
							SKILLS
						</h2>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
							{skills.map((s) => (
								<span key={s} style={{ background: `linear-gradient(135deg, ${accentLight}, #eff6ff)`, color: accent, padding: '2px 7px', borderRadius: '6px', fontSize: '7.5px', fontWeight: 600, border: `1px solid ${accent}33` }}>{s}</span>
							))}
						</div>
					</div>
				)}

				{projects.length > 0 && (
					<div style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: accent, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
							<span style={{ display: 'inline-block', width: '14px', height: '2px', background: accent, borderRadius: '1px' }} />
							PROJECTS
						</h2>
						{projects.map((p) => (
							<div key={p.id} style={{ marginBottom: '6px' }}>
								<strong style={{ fontSize: '9px' }}>{p.name}</strong>
								{p.techStack && <span style={{ fontSize: '8px', color: '#64748b' }}> — {p.techStack}</span>}
								{p.description && <p style={{ color: '#475569', marginTop: '1px' }}>{p.description}</p>}
							</div>
						))}
					</div>
				)}

				{certifications.length > 0 && (
					<div style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: accent, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
							<span style={{ display: 'inline-block', width: '14px', height: '2px', background: accent, borderRadius: '1px' }} />
							CERTIFICATIONS
						</h2>
						{certifications.map((c) => <p key={c.id} style={{ marginBottom: '2px' }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</p>)}
					</div>
				)}

				{achievements.length > 0 && (
					<div style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: accent, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
							<span style={{ display: 'inline-block', width: '14px', height: '2px', background: accent, borderRadius: '1px' }} />
							ACHIEVEMENTS
						</h2>
						{achievements.map((a) => a.text && <p key={a.id} style={{ marginBottom: '2px' }}>★ {a.text}</p>)}
					</div>
				)}

				{languages.length > 0 && (
					<div style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: accent, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
							<span style={{ display: 'inline-block', width: '14px', height: '2px', background: accent, borderRadius: '1px' }} />
							LANGUAGES
						</h2>
						<p style={{ fontSize: '8.5px' }}>{languages.map((l) => `${l.language} (${l.proficiency})`).join('  ·  ')}</p>
					</div>
				)}

				{customSections.map((cs) => cs.title && (
					<div key={cs.id} style={{ marginBottom: '14px' }}>
						<h2 style={{ fontSize: '10px', fontWeight: 700, color: accent, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
							<span style={{ display: 'inline-block', width: '14px', height: '2px', background: accent, borderRadius: '1px' }} />
							{cs.title.toUpperCase()}
						</h2>
						<p>{cs.content}</p>
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
