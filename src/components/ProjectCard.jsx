import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';

export function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.slug}`} className="group block">
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
      <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        {project.year}
      </div>
    </Link>
  );
}
