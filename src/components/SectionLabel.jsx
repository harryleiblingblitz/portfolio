import { cn } from '@/lib/utils';

export function SectionLabel({ index, children, className }) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <span className="font-mono text-[11px] text-accent">[{index}]</span>
      <span className="mono-label">{children}</span>
      <span className="hairline h-px flex-1 border-t" />
    </div>
  );
}
