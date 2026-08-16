import { cn } from '@/lib/utils';

// Named export (never default) — matches the import convention used
// throughout the rest of the codebase: import { Image } from '@/components/ui/image'
export function Image({ src, alt = '', className, fittingType = 'fill', ...props }) {
  if (!src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          className
        )}
      >
        <span className="mono-label">No image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={cn(fittingType === 'fill' ? 'object-cover' : 'object-contain', className)}
      {...props}
    />
  );
}
