interface BadgeProps {
  children: React.ReactNode
  variant?: 'fury' | 'strategy' | 'comedy' | 'draft' | 'evaluated' | 'approved' | 'rejected' | 'default'
  size?: 'sm' | 'md'
  className?: string
}

const variantStyles: Record<string, string> = {
  fury: 'bg-error/15 text-error border-error/20',
  strategy: 'bg-primary/15 text-primary border-primary/20',
  comedy: 'bg-warning/15 text-warning border-warning/20',
  draft: 'bg-on-surface-variant/15 text-on-surface-variant border-on-surface-variant/20',
  evaluated: 'bg-tertiary/15 text-tertiary border-tertiary/20',
  approved: 'bg-success/15 text-success border-success/20',
  rejected: 'bg-error/15 text-error border-error/20',
  default: 'bg-white/10 text-on-surface-variant border-white/10',
}

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  const sizeClass = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5' 
    : 'text-xs px-2.5 py-1'

  return (
    <span className={`
      inline-flex items-center font-bold uppercase tracking-wider rounded-full border
      ${variantStyles[variant]}
      ${sizeClass}
      ${className}
    `}>
      {children}
    </span>
  )
}
