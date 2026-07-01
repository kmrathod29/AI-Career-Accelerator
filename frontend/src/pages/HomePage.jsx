export function HomePage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]">
          Foundation
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text)] md:text-6xl">
          Production-ready architecture scaffold.
        </h1>
        <p className="mt-6 text-base leading-7 text-[var(--color-muted)] md:text-lg">
          Routes, layouts, reusable UI primitives, theme variables, and future-ready modules are in place.
        </p>
      </div>
    </section>
  )
}