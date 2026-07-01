import { forwardRef } from 'react'
import { cn } from '@utils/classNames.js'

export const Container = forwardRef(function Container({ className, ...props }, ref) {
  return <div ref={ref} className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props} />
})