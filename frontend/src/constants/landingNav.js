import { APP_ROUTES } from './routes.js'

/**
 * Landing page mobile drawer navigation links.
 * Hash anchors match section ids on HomePage.
 */
export const LANDING_NAV_LINKS = [
	{ label: 'Home', href: `${APP_ROUTES.HOME}#home` },
	{ label: 'Features', href: '/#features' },
	{ label: 'How It Works', href: '/#how-it-works' },
	{ label: 'Pricing', href: '/#pricing' },
	{ label: 'FAQ', href: '/#faq' },
]
