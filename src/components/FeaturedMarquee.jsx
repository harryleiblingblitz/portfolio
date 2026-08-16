import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { Image } from '@/components/ui/image';

const DURATION_S = 28;

function MarqueeCard({ project }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block w-[340px] shrink-0 sm:w-[420px]"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted">
        <Image
          src={project.hero_image}
          alt={project.title}
          className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute left-3 top-3 rounded-full border border-border bg-background/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] backdrop-blur">
          {project.category}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">{project.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{project.short_description}</p>
    </Link>
  );
}

export function FeaturedMarquee({ projects }) {
  const reducedMotion = useReducedMotion();

  if (projects.length === 0) return null;

  const track = reducedMotion ? projects : [...projects, ...projects];

  return (
    <div className="overflow-hidden">
      <div
        className={reducedMotion ? 'flex gap-8' : 'marquee-track flex gap-8'}
        style={reducedMotion ? undefined : { animationDuration: `${DURATION_S}s` }}
      >
        {track.map((project, i) => (
          <MarqueeCard key={`${project.slug}-${i}`} project={project} />
        ))}
      </div>
    </div>
  );
}
