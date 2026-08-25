import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plane } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { cn } from '@/lib/utils';

// Hotspot coordinates are percentages measured directly against
// /images/cockpit/cockpit-pov.jpg — they only stay correct if that
// exact image (and its aspect ratio, set below) doesn't change.
const SWITCH_ROW_Y = 47.6;
const SWITCH_X = [33.1, 39.1, 45.1, 51.1, 57.1, 63.1];
const THROTTLE_TRACK = { x: 50, top: 67, bottom: 84 };
const COCKPIT_ASPECT = '2568 / 1440';

const panelVariants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function Gauge({ label, value }) {
  if (!value) return null;
  return (
    <span className="rounded-md border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
      {label}
      <span className="ml-2 text-foreground">{value}</span>
    </span>
  );
}

export function CockpitExplorer({ projects, categories }) {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);

  const filtered = useMemo(
    () => (activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory)),
    [projects, activeCategory]
  );
  const count = filtered.length;

  useEffect(() => {
    setIndex(0);
  }, [activeCategory, projects]);

  function goTo(next) {
    setIndex((current) => Math.min(Math.max(next, 0), count - 1));
  }

  useEffect(() => {
    function onKeyDown(event) {
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        goTo(index + 1);
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        goTo(index - 1);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, count]);

  function fractionToIndex(clientY) {
    const rect = trackRef.current.getBoundingClientRect();
    const fraction = 1 - (clientY - rect.top) / rect.height;
    const clamped = Math.min(Math.max(fraction, 0), 1);
    return Math.round(clamped * (count - 1));
  }

  function onPointerDown(event) {
    if (count < 2) return;
    draggingRef.current = true;
    setDragging(true);
    event.target.setPointerCapture?.(event.pointerId);
    goTo(fractionToIndex(event.clientY));
  }

  function onPointerMove(event) {
    if (!draggingRef.current) return;
    goTo(fractionToIndex(event.clientY));
  }

  function onPointerUp() {
    draggingRef.current = false;
    setDragging(false);
  }

  if (count === 0) {
    return <p className="py-24 text-center text-muted-foreground">No projects in this category yet.</p>;
  }

  const project = filtered[index];
  const handlePercent = count > 1 ? (index / (count - 1)) * 100 : 100;
  const handleTop = THROTTLE_TRACK.bottom - (handlePercent / 100) * (THROTTLE_TRACK.bottom - THROTTLE_TRACK.top);

  return (
    <div className="grid gap-12 pb-8 lg:grid-cols-12 lg:items-center lg:gap-10">
      <div className="lg:col-span-7">
        <div
          className="relative w-full select-none overflow-hidden rounded-lg border border-border bg-black"
          style={{ aspectRatio: COCKPIT_ASPECT }}
        >
          <img
            src="/images/cockpit/cockpit-pov.jpg"
            alt="Airliner cockpit"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />

          {categories.map((cat, i) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                title={cat}
                aria-label={`Filter by ${cat}`}
                aria-pressed={active}
                onClick={() => setActiveCategory(cat)}
                className="group absolute flex h-[4%] w-[4%] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ left: `${SWITCH_X[i]}%`, top: `${SWITCH_ROW_Y}%` }}
              >
                <span
                  className={cn(
                    'block h-full w-full rounded-[2px] border transition-all duration-200',
                    active
                      ? 'border-accent bg-accent shadow-[0_0_10px_2px_hsl(var(--accent)/0.9)]'
                      : 'border-white/40 bg-black/30 group-hover:border-white/80'
                  )}
                />
                <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded border border-border bg-background/95 px-2 py-1 font-mono text-[10px] text-foreground opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
                  {cat}
                </span>
              </button>
            );
          })}

          <div
            ref={trackRef}
            className="absolute w-[3%] -translate-x-1/2 cursor-ns-resize touch-none rounded-full bg-black/40"
            style={{
              left: `${THROTTLE_TRACK.x}%`,
              top: `${THROTTLE_TRACK.top}%`,
              height: `${THROTTLE_TRACK.bottom - THROTTLE_TRACK.top}%`,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div
              className={cn(
                'absolute left-1/2 h-[10%] w-[220%] -translate-x-1/2 -translate-y-1/2 rounded-sm border border-accent/80 bg-accent shadow-[0_0_12px_2px_hsl(var(--accent)/0.8)]',
                !dragging && 'transition-[top] duration-300 ease-out'
              )}
              style={{ top: `${((handleTop - THROTTLE_TRACK.top) / (THROTTLE_TRACK.bottom - THROTTLE_TRACK.top)) * 100}%` }}
            />
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          Drag the throttle, or use <span className="text-foreground">↑ ↓</span> · switches filter by discipline
        </p>
      </div>

      <div className="lg:col-span-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.slug}
            variants={panelVariants}
            initial={reducedMotion ? 'center' : 'enter'}
            animate="center"
            exit={reducedMotion ? 'center' : 'exit'}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted">
              <Image src={project.hero_image} alt={project.title} className="h-full w-full" fittingType="fill" />
              <span className="absolute left-3 top-3 rounded-full border border-border bg-background/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] backdrop-blur">
                {project.category}
              </span>
            </div>

            <span className="mono-label mt-6 block">
              Flight {String(index + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}
            </span>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h3>

            <div className="mt-6 flex flex-wrap gap-2">
              <Gauge label="Year" value={project.year} />
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
