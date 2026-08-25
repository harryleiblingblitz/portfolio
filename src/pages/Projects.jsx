import { useMemo, useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { RadarExplorer } from '@/components/RadarExplorer';
import { CockpitExplorer } from '@/components/CockpitExplorer';
import { ProjectCard } from '@/components/ProjectCard';
import { SectionLabel } from '@/components/SectionLabel';
import { Reveal } from '@/components/Reveal';
import { cn } from '@/lib/utils';

// Set to 'radar' to instantly revert the timeline view back to the
// original radar-sweep explorer, no other changes needed.
const TIMELINE_VARIANT = 'radar';

export default function Projects() {
  const { data: projects } = useProjects();
  const [view, setView] = useState('timeline');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('oldest');

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [projects]);

  const chronological = useMemo(() => {
    const sorted = [...projects].sort((a, b) => new Date(a.date) - new Date(b.date));
    return sortOrder === 'newest' ? sorted.reverse() : sorted;
  }, [projects, sortOrder]);

  const filteredGrid = useMemo(() => {
    if (activeFilter === 'All') return chronological;
    return chronological.filter((p) => p.category === activeFilter);
  }, [chronological, activeFilter]);

  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <Reveal>
        <SectionLabel index="∞" className="mb-8 max-w-md">
          Timeline
        </SectionLabel>
      </Reveal>

      <Reveal delay={0.05}>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Explore my work
        </h1>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-full border border-border p-1">
          <button
            type="button"
            onClick={() => setView('timeline')}
            className={cn(
              'rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300',
              view === 'timeline' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Timeline
          </button>
          <button
            type="button"
            onClick={() => setView('grid')}
            className={cn(
              'rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300',
              view === 'grid' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Grid
          </button>
        </div>

        {view === 'timeline' && (
          <div className="inline-flex rounded-full border border-border p-1">
            <button
              type="button"
              onClick={() => setSortOrder('oldest')}
              className={cn(
                'rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300',
                sortOrder === 'oldest' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Oldest first
            </button>
            <button
              type="button"
              onClick={() => setSortOrder('newest')}
              className={cn(
                'rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300',
                sortOrder === 'newest' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Newest first
            </button>
          </div>
        )}

        {view === 'grid' && (
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="rounded-full border border-border bg-background px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground outline-none focus:border-accent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
      </Reveal>

      <div className="mt-16">
        {view === 'timeline' ? (
          TIMELINE_VARIANT === 'cockpit' ? (
            <CockpitExplorer projects={chronological} categories={categories} />
          ) : (
            <RadarExplorer projects={chronological} />
          )
        ) : filteredGrid.length === 0 ? (
          <p className="py-24 text-center text-muted-foreground">No projects in this category yet.</p>
        ) : (
          <div className="flex flex-wrap gap-x-8 gap-y-14 pb-8">
            {filteredGrid.map((project) => (
              <div key={project.slug} className="w-[238px] sm:w-[294px]">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
