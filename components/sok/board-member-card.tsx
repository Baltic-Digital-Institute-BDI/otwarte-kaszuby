import type { BoardMember } from '@/lib/data/types'
import { formatDate } from '@/lib/utils'

export function BoardMemberCard({ member }: { member: BoardMember }) {
  return (
    <article className="bg-[var(--color-ok-bg-tertiary)] rounded-xl p-6 lg:p-8 border border-[var(--color-ok-border-default)]">
      <div className="flex items-start gap-4 mb-4">
        <div className="size-16 rounded-full bg-[var(--color-ok-primary-100)] flex items-center justify-center font-headline font-bold text-2xl text-[var(--color-ok-primary)]">
          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
        </div>
        <div>
          <h3 className="font-headline text-lg lg:text-xl font-semibold leading-tight mb-1">
            {member.firstName} {member.lastName}
          </h3>
          <p className="text-sm text-[var(--color-ok-primary)] font-medium">{member.positionLabel}</p>
        </div>
      </div>
      <p className="text-xs text-[var(--color-ok-text-tertiary)] uppercase tracking-wide mb-3">
        Powołana/y od {formatDate(member.since)}
      </p>
      {member.bio && <p className="text-sm text-[var(--color-ok-text-secondary)] leading-relaxed">{member.bio}</p>}
    </article>
  )
}
