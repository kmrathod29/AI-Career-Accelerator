import { memo } from 'react'

const LOGOS = [
  {
    name: 'Google',
    svg: (
      <svg className="h-6 w-auto text-[var(--color-muted)] opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.173-2.763-6.173-6.173s2.763-6.173 6.173-6.173c1.554 0 2.979.577 4.07 1.534l3.1-3.1C19.16 2.138 15.935 1 12.24 1 5.922 1 1 5.922 1 12.24s4.922 11.24 11.24 11.24c5.845 0 10.762-4.218 10.762-11.24 0-.648-.058-1.285-.175-1.955H12.24z" />
      </svg>
    ),
  },
  {
    name: 'Meta',
    svg: (
      <svg className="h-6 w-auto text-[var(--color-muted)] opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.54 5.568c-1.39 0-2.613.68-3.54 1.706-.927-1.026-2.15-1.706-3.54-1.706C5.034 5.568 2 8.602 2 12.35c0 3.748 3.034 6.782 6.46 6.782 1.39 0 2.613-.68 3.54-1.706.927 1.026 2.15 1.706 3.54 1.706 3.426 0 6.46-3.034 6.46-6.782 0-3.748-3.034-6.782-6.46-6.782zm0 11.582c-2.484 0-4.5-2.016-4.5-4.5s2.016-4.5 4.5-4.5 4.5 2.016 4.5 4.5-2.016 4.5-4.5 4.5zm-7.08 0c-2.484 0-4.5-2.016-4.5-4.5s2.016-4.5 4.5-4.5 4.5 2.016 4.5 4.5-2.016 4.5-4.5 4.5z" />
      </svg>
    ),
  },
  {
    name: 'Stripe',
    svg: (
      <svg className="h-6 w-auto text-[var(--color-muted)] opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.962 10.455c0-1.002-.756-1.534-2.036-1.534-1.543 0-2.909.52-3.834 1.054V6.262c.983-.377 2.378-.65 3.86-.65 3.738 0 5.86 1.764 5.86 4.908v7.83h-3.85v-.909c-.832.703-2.17 1.079-3.665 1.079-2.99 0-4.996-1.637-4.996-4.302 0-3.5 3.328-4.502 8.661-4.763zm-3.85 5.094c0 .872.676 1.288 1.833 1.288.989 0 1.63-.3 2.017-.676v-2.288c-1.872.156-3.85.559-3.85 1.676z" />
      </svg>
    ),
  },
  {
    name: 'Netflix',
    svg: (
      <svg className="h-6 w-auto text-[var(--color-muted)] opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.5 2h4l4.5 10.5L18.5 2h4v20h-4V7.5L14 18h-2L7.5 7.5V22h-2V2z" />
      </svg>
    ),
  },
  {
    name: 'Vercel',
    svg: (
      <svg className="h-5 w-auto text-[var(--color-muted)] opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 76 65" fill="currentColor">
        <path d="M37.5273 0L75.0546 65H0L37.5273 0Z" />
      </svg>
    ),
  },
  {
    name: 'Supabase',
    svg: (
      <svg className="h-6 w-auto text-[var(--color-muted)] opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.362 10.605l-7.79 4.417a.6.6 0 01-.89-.523v-2.317a.3.3 0 00-.462-.25l-9.582 5.568c-.604.351-.122 1.288.549 1.134l8.368-1.923a.6.6 0 01.713.488v2.32a.3.3 0 00.472.247l9.645-6.848c.594-.422-.027-1.32-.613-.996zM2.638 13.395l7.79-4.417a.6.6 0 01.89.523v2.317c0 .24.26.39.462.25l9.582-5.568c.604-.351.122-1.288-.549-1.134L12.445 7.29a.6.6 0 01-.713-.488V4.482a.3.3 0 00-.472-.247L1.615 11.083c-.594.422.027 1.32.623.996z" />
      </svg>
    ),
  },
  {
    name: 'Linear',
    svg: (
      <svg className="h-6 w-auto text-[var(--color-muted)] opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 14.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5zm2.5-5.5c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z" />
      </svg>
    ),
  },
]

export const TrustedBy = memo(function TrustedBy() {
  return (
    <section className="relative w-full border-y border-[var(--color-border)]/40 bg-[var(--color-surface)]/20 py-10 overflow-hidden">
      {/* Edge gradient masks to fade the scrolling marquee */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[var(--color-bg)] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[var(--color-bg)] to-transparent z-10 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)] mb-8">
          Accelerating Careers of Professionals at
        </p>
      </div>

      {/* Infinite marquee container */}
      <div className="flex w-full overflow-hidden select-none">
        <div className="flex min-w-full shrink-0 items-center justify-around gap-16 pr-16 animate-marquee">
          {LOGOS.map((logo, idx) => (
            <div key={`${logo.name}-${idx}`} className="flex items-center justify-center" title={logo.name}>
              {logo.svg}
            </div>
          ))}
        </div>
        <div className="flex min-w-full shrink-0 items-center justify-around gap-16 pr-16 animate-marquee" aria-hidden="true">
          {LOGOS.map((logo, idx) => (
            <div key={`${logo.name}-dup-${idx}`} className="flex items-center justify-center" title={logo.name}>
              {logo.svg}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})
