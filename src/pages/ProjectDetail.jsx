import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Plane, ExternalLink, FileText, Github, Star } from 'lucide-react';
import { useProjectBySlug, useProjects } from '@/hooks/useProjects';
import { Image } from '@/components/ui/image';
import { Reveal } from '@/components/Reveal';
import { ProjectCard } from '@/components/ProjectCard';
import PageNotFound from '@/lib/PageNotFound';

function Block({ index, title, children }) {
  if (!children) return null;
  return (
    <Reveal className="grid gap-6 border-t border-border py-10 sm:grid-cols-12">
      <div className="sm:col-span-3">
        <span className="font-mono text-[11px] text-accent">{index}</span>
        <h2 className="mt-2 text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="prose-eng sm:col-span-9">
        <p>{children}</p>
      </div>
    </Reveal>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project } = useProjectBySlug(slug);
  const { data: allProjects } = useProjects();

  const related = useMemo(() => {
    if (!project) return [];
    return allProjects
      .filter((p) => p.slug !== project.slug)
      .map((p) => {
        const manual = (project.related_project_ids ?? []).includes(p.slug) ? 10 : 0;
        const shared = (p.disciplines ?? []).filter((d) => (project.disciplines ?? []).includes(d)).length;
        return { project: p, score: manual + shared };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((entry) => entry.project);
  }, [project, allProjects]);

  if (!project) return <PageNotFound />;

  const specs = [
    { label: 'Category', value: project.category },
    { label: 'Date', value: project.date },
    { label: 'Duration', value: project.duration },
    { label: 'Disciplines', value: (project.disciplines ?? []).join(', ') },
    { label: 'Tools', value: (project.technologies ?? []).join(', ') },
  ].filter((s) => s.value);

  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={13} />
        All projects
      </Link>

      <Reveal className="mt-8">
        <div className="mono-label mb-4 flex items-center gap-3">
          <span>{project.category}</span>
          {project.featured && <Star size={11} className="text-accent" fill="currentColor" />}
          {project.date && <span>{project.date}</span>}
        </div>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">{project.title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{project.short_description}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:border-foreground/30"
            >
              <Github size={14} /> Repository
            </a>
          )}
          {project.external_url && (
            <a
              href={project.external_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:border-foreground/30"
            >
              <ExternalLink size={14} /> Live
            </a>
          )}
          {project.report_url && (
            <a
              href={project.report_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:border-foreground/30"
            >
              <FileText size={14} /> Report
            </a>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mt-12 aspect-[16/9] overflow-hidden rounded-lg border border-border bg-muted">
        <Image src={project.hero_image} alt={project.title} className="h-full w-full" />
      </Reveal>

      <div className="mt-16 grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <div className="sticky top-32 space-y-5 border-t border-border pt-6">
            {specs.map((spec) => (
              <div key={spec.label}>
                <p className="mono-label mb-1">{spec.label}</p>
                <p className="text-sm text-foreground/85">{spec.value}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="lg:col-span-9">
          {project.full_description && (
            <div className="prose-eng">
              <ReactMarkdown>{project.full_description}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      <div>
        <Block index="01" title="Motivation">{project.motivation}</Block>
        <Block index="02" title="Engineering approach">{project.methodology}</Block>
        <Block index="03" title="Results">{project.results}</Block>
        <Block index="04" title="Lessons learned">{project.lessons_learned}</Block>
      </div>

      <Reveal className="flex flex-wrap items-center justify-between gap-6 border-t border-border py-10">
        <div>
          {project.key_concepts?.length > 0 && (
            <>
              <p className="mono-label mb-4">Key concepts</p>
              <div className="flex flex-wrap gap-2">
                {project.key_concepts.map((k) => (
                  <span
                    key={k}
                    className="rounded-full border border-border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        <Link
          to="/contact"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background"
        >
          Find out more
          <Plane size={15} />
        </Link>
      </Reveal>

      {project.gallery?.length > 0 && (
        <Reveal className="border-t border-border py-10">
          <p className="mono-label mb-6">Gallery</p>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {project.gallery.map((src, i) => (
              <div
                key={i}
                className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted"
              >
                <Image src={src} alt={`${project.title} ${i + 1}`} className="h-full w-full" />
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {related.length > 0 && (
        <section className="border-t border-border py-16">
          <p className="mono-label mb-10">Related work</p>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
