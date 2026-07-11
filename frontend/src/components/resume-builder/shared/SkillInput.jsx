import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * SkillInput — chip-based skill input.
 * Type a skill → press Enter → chip appears. Click × to remove.
 */
export function SkillInput({ skills = [], onAdd, onRemove }) {
	const [value, setValue] = useState('')

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && value.trim()) {
			e.preventDefault()
			onAdd(value.trim())
			setValue('')
		}
		if (e.key === 'Backspace' && !value && skills.length > 0) {
			onRemove(skills[skills.length - 1])
		}
	}

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap gap-2">
				<AnimatePresence>
					{skills.map((skill) => (
						<motion.span
							key={skill}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.15 }}
							className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)]/8 px-3 py-1.5 text-xs font-medium text-[var(--color-primary)]"
						>
							{skill}
							<button
								type="button"
								onClick={() => onRemove(skill)}
								className="rounded-full p-0.5 transition-colors hover:bg-[var(--color-primary)]/15"
							>
								<X className="h-3 w-3" />
							</button>
						</motion.span>
					))}
				</AnimatePresence>
			</div>

			<input
				type="text"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Type a skill and press Enter..."
				className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
			/>
		</div>
	)
}
