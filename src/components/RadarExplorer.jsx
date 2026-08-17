import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion';
import { Plane } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { cn } from '@/lib/utils';

const SWEEP_SECONDS = 10;
const RING_RADII = [46, 31, 16];
const COMPASS_TICKS = [
  { angle: 0, label: '000' },
  { angle: 90, label: '090' },
  { angle: 180, label: '180' },
  { angle: 270, label: '270' },
];
const MINOR_TICKS = [45, 135, 225, 315];

function polarToPercent(angleDeg, radiusPercent) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    left: `${50 + radiusPercent * Math.sin(rad)}%`,
    top: `${50 - radiusPercent * Math.cos(rad)}%`,
  };
}

function AnimatedYear({ year, reducedMotion }) {
  const [display, setDisplay] = useState(year);
  const prevYear = useRef(year);

  useEffect(() => {
    if (reducedMotion || prevYear.current === year) {
      setDisplay(year);
      prevYear.current = year;
      return;
    }
    const controls = animate(prevYear.current, year, {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => setDisplay(Math.round(value)),
    });
    prevYear.current = year;
    return () => controls.stop();
  }, [year, reducedMotion]);

  return <>{display}</>;
}

function Gauge({ label, value }) {
  if (!value) return null;
  return (
    <span className="rounded-md border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
      {label}
      <span className="ml-2 text-foreground">{value}</span>
    </span>
  );
}

const panelVariants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export function RadarExplorer({ projects }) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = projects.length;

  useEffect(() => {
    setIndex(0);
  }, [projects]);

  useEffect(() => {
    function onKeyDown(event) {
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (event.key === 'ArrowRight') goTo(index + 1);
      if (event.key === 'ArrowLeft') goTo(index - 1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, count]);

  if (count === 0) {
    return <p className="py-24 text-center text-muted-foreground">No projects in this category yet.</p>;
  }

  function goTo(nextIndex) {
    if (nextIndex < 0 || nextIndex >= count) return;
    setIndex(nextIndex);
  }

  const project = projects[index];

  return (
    <div className="grid gap-12 pb-8 lg:grid-cols-12 lg:items-center lg:gap-10">
      <div className="mx-auto w-full max-w-[380px] lg:col-span-5">
        <div className="relative aspect-square rounded-full border border-border">
          {RING_RADII.map((r) => (
            <span
              key={r}
              className="absolute rounded-full border border-border/60"
              style={{
                left: `${50 - r}%`,
                top: `${50 - r}%`,
                width: `${r * 2}%`,
                height: `${r * 2}%`,
              }}
            />
          ))}

          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div
              className={cn('absolute inset-0', !reducedMotion && 'animate-radar-sweep')}
              style={{
                background:
                  'conic-gradient(from 0deg, hsl(var(--accent) / 0.35), transparent 70deg, transparent 360deg)',
              }}
            />
          </div>

          {COMPASS_TICKS.map((tick) => {
            const pos = polarToPercent(tick.angle, 49);
            return (
              <span
                key={tick.label}
                className="absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] tracking-[0.1em] text-muted-foreground"
                style={pos}
              >
                {tick.label}
              </span>
            );
          })}

          {MINOR_TICKS.map((angle) => {
            const pos = polarToPercent(angle, 46);
            return (
              <span
                key={angle}
                className="absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border"
                style={pos}
              />
            );
          })}

          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />

          {projects.map((p, i) => {
            const angle = (i / count) * 360;
            const pos = polarToPercent(angle, 38);
            const active = i === index;
            return (
              <motion.button
                key={p.slug}
                type="button"
                layout
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                onClick={() => goTo(i)}
                aria-label={`View ${p.title}`}
                aria-current={active}
                className="group absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={pos}
              >
                {active && (
                  <span className="pointer-events-none absolute inset-0">
                    <span className="absolute left-0 top-0 h-2 w-2 border-l-2 border-t-2 border-accent" />
                    <span className="absolute right-0 top-0 h-2 w-2 border-r-2 border-t-2 border-accent" />
                    <span className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-accent" />
                    <span className="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-accent" />
                  </span>
                )}
                <span
                  className={cn(
                    'block rounded-full transition-all duration-300',
                    active
                      ? 'h-2.5 w-2.5 bg-accent'
                      : cn('h-1.5 w-1.5 bg-foreground/50 group-hover:bg-foreground', !reducedMotion && 'animate-radar-ping')
                  )}
                  style={!active && !reducedMotion ? { animationDelay: `${(angle / 360) * SWEEP_SECONDS}s` } : undefined}
                />
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-7">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.slug}
            variants={panelVariants}
            initial={reducedMotion ? 'center' : 'enter'}
            animate="center"
            exit={reducedMotion ? 'center' : 'exit'}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-8 sm:grid-cols-12"
          >
            <div className="sm:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted">
                <Image src={project.hero_image} alt={project.title} className="h-full w-full" fittingType="fill" />
                <span className="absolute left-3 top-3 rounded-full border border-border bg-background/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] backdrop-blur">
                  {project.category}
                </span>
              </div>
            </div>

            <div className="sm:col-span-7">
              <span className="mono-label">
                Target · {String(index + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h3>

              <div className="mt-6 flex flex-wrap gap-2">
                <Gauge label="Year" value={<AnimatedYear year={project.year} reducedMotion={reducedMotion} />} />
                <Gauge label="Category" value={project.category} />
                <Gauge label="Tool" value={project.technologies?.[0]} />
              </div>

              <p className="mt-6 max-w-xl text-muted-foreground">{project.short_description}</p>

              <div className="mt-8">
                <Link
                  to={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background"
                >
                  View project
                  <Plane size={15} />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
