import { useMemo, useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { RadarExplorer } from '@/components/RadarExplorer';
import { CockpitExplorer } from '@/components/CockpitExplorer';
import { CockpitScrollExplorer } from '@/components/CockpitScrollExplorer';
import { AircraftWindowsExplorer } from '@/components/AircraftWindowsExplorer';
import { ProjectCard } from '@/components/ProjectCard';
import { SectionLabel } from '@/components/SectionLabel';
import { Reveal } from '@/components/Reveal';
import { cn } from '@/lib/utils';

// 'radar' = original radar-sweep explorer, 'cockpit' = boxed cockpit
// photo with a draggable throttle overlay (shelved), 'cockpit-scroll' =
// full-bleed cockpit with scroll-driven crossfade between projects,
// 'aircraft-windows' = side-on A350 with lit windows per project (oldest
// at the tail, newest at the nose). Switch back to 'radar' any time to
// instantly revert, no other changes needed.
const TIMELINE_VARIANT = 'aircraft-windows';

export default function Projects() {
  const { data: projects } = useProjects();
  const [showGrid, setShowGrid] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [projects]);

  const chronological = useMemo(
    () => [...projects].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [projects]
  );

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

      <Reveal delay={0.05} className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Explore my work
          </h1>
          {!showGrid && (
            <p className="mt-4 text-balance font-mono text-base uppercase tracking-[0.14em] text-muted-foreground sm:text-lg">
              Click a lit window to explore a project
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowGrid((prev) => !prev)}
            aria-pressed={showGrid}
            className={cn(
              'rounded-full border border-border px-6 py-2.5 font-mono text-sm uppercase tracking-[0.14em] transition-colors duration-300',
              showGrid ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Grid
          </button>

          {showGrid && (
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="rounded-full border border-border bg-background px-6 py-2.5 font-mono text-sm uppercase tracking-[0.14em] text-foreground outline-none focus:border-accent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
      </Reveal>

      <div className="mt-16">
        {!showGrid ? (
          TIMELINE_VARIANT === 'cockpit' ? (
            <CockpitExplorer projects={chronological} categories={categories} />
          ) : TIMELINE_VARIANT === 'cockpit-scroll' ? (
            <CockpitScrollExplorer projects={chronological} />
          ) : TIMELINE_VARIANT === 'aircraft-windows' ? (
            <AircraftWindowsExplorer projects={chronological} />
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
