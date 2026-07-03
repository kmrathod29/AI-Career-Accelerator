import { Sun, Moon, Monitor, Palette, Type, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { ThemeToggle } from '@components/ui/ThemeToggle.jsx'
import { SettingsCard, SettingsRow } from './shared/SettingsCard.jsx'
import { ToggleSwitch } from './shared/ToggleSwitch.jsx'
import { useTheme } from '@providers/useTheme.js'
import { THEMES } from '@constants/theme.js'
import { accountStore, useAppearancePrefs } from '@/stores/accountStore.js'
import { cn } from '@utils/classNames.js'

const THEME_OPTIONS = [
	{ value: THEMES.LIGHT, label: 'Light', icon: Sun },
	{ value: THEMES.DARK, label: 'Dark', icon: Moon },
	{ value: THEMES.SYSTEM, label: 'System', icon: Monitor },
]

export function AppearanceSettings() {
	const { theme, setTheme, setReducedMotion } = useTheme()
	const appearancePrefs = useAppearancePrefs()

	const handleTheme = (value) => {
		setTheme(value)
		toast.success('Theme updated')
	}

	const handleReducedMotion = (enabled) => {
		accountStore.updateAppearancePrefs({ reducedMotion: enabled })
		setReducedMotion(enabled)
		toast.success(enabled ? 'Reduced motion enabled' : 'Reduced motion disabled')
	}

	const handleComingSoon = (feature) => {
		toast.info('Coming Soon', { description: `${feature} will be available in a future update.` })
	}

	return (
		<div className="space-y-4">
			<SettingsCard title="Theme" description="Choose how AI Career Accelerator looks on your device.">
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm font-medium text-[var(--color-text)]">Quick Toggle</p>
						<p className="mt-0.5 text-xs text-[var(--color-muted)]">Switch between light and dark instantly.</p>
					</div>
					<ThemeToggle />
				</div>

				<div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
					{THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
						<button
							key={value}
							type="button"
							onClick={() => handleTheme(value)}
							className={cn(
								'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200',
								theme === value
									? 'border-[var(--color-primary)] bg-[var(--color-surface-2)] text-[var(--color-primary)]'
									: 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-surface-2)]',
							)}
						>
							<Icon className="h-5 w-5" strokeWidth={1.8} />
							<span className="text-xs font-medium">{label}</span>
						</button>
					))}
				</div>
			</SettingsCard>

			<SettingsCard title="Customization" description="Personalize your experience.">
				<div className="divide-y divide-[var(--color-border)]">
					<SettingsRow label="Accent Color" description="Customize the primary brand color across the app.">
						<button
							type="button"
							onClick={() => handleComingSoon('Accent Color')}
							className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)]"
						>
							<Palette className="h-4 w-4" />
							Coming Soon
						</button>
					</SettingsRow>

					<SettingsRow label="Font Size" description="Adjust text size for better readability.">
						<div className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-inset)] px-4 py-2 text-xs font-medium text-[var(--color-muted)]">
							<Type className="h-4 w-4" />
							Default
						</div>
					</SettingsRow>

					<SettingsRow label="Reduced Motion" description="Minimize animations throughout the interface.">
						<ToggleSwitch
							checked={appearancePrefs.reducedMotion}
							onChange={handleReducedMotion}
							label="Reduced motion"
						/>
					</SettingsRow>
				</div>
			</SettingsCard>

			<div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-4">
				<Sparkles className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
				<p className="text-xs leading-relaxed text-[var(--color-muted)]">
					More appearance options including custom themes and layout density are on the roadmap.
				</p>
			</div>
		</div>
	)
}
