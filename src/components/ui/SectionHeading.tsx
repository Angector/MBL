import { cn } from '@/lib/utils/cn';

interface Props {
  eyebrow?: string;
  title: string;
  accent?: string;
  text?: string;
  align?: 'center' | 'start';
  tone?: 'dark' | 'light';
  as?: 'h1' | 'h2';
  className?: string;
}

export function SectionHeading({ eyebrow, title, accent, text, align = 'center', tone = 'dark', as: Tag = 'h2', className }: Props) {
  const light = tone === 'light';
  return (
    <div className={cn('flex flex-col gap-3', align === 'center' ? 'items-center text-center' : 'items-start text-start', className)}>
      {eyebrow && (
        <p className={cn('flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase', light ? 'text-ivory/80' : 'text-olive-muted')}>
          <span aria-hidden className="h-px w-8 bg-current opacity-50" />
          {eyebrow}
          <span aria-hidden className="h-px w-8 bg-current opacity-50" />
        </p>
      )}
      <Tag className={cn('text-balance text-4xl font-bold md:text-5xl', light ? 'text-ivory' : 'text-olive-deep')}>
        {title}
        {accent && (
          <>
            {' '}
            <span className={cn('accent', light && '!text-ivory/80')}>{accent}</span>
          </>
        )}
      </Tag>
      {text && <p className={cn('max-w-xl text-pretty text-base font-light md:text-lg', light ? 'text-ivory/85' : 'text-ink/75')}>{text}</p>}
    </div>
  );
}
