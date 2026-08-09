import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-bolha border-4 border-white bg-white/85 p-6 shadow-flutuante backdrop-blur-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
