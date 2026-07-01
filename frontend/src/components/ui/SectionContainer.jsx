import { forwardRef } from 'react'
import { cn } from '@utils/classNames.js'

export const SectionContainer = forwardRef(function SectionContainer(
  { className, id, children, ...props },
  ref,
) {
  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        'mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
})
