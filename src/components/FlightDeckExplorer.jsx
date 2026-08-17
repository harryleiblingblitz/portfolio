import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion';
import { Plane } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { cn } from '@/lib/utils';

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

function CornerBrackets() {
  const base = 'pointer-events-none absolute h-5 w-5 border-accent/70';
  return (
    <>
      <span className={cn(base, 'left-2 top-2 border-l-2 border-t-2')} />
      <span className={cn(base, 'right-2 top-2 border-r-2 border-t-2')} />
      <span className={cn(base, 'bottom-2 left-2 border-b-2 border-l-2')} />
      <span className={cn(base, 'bottom-2 right-2 border-b-2 border-r-2')} />
    </>
  );
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
  enter: (direction) => ({ opacity: 0, x: direction >= 0 ? 36 : -36 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction >= 0 ? -36 : 36 }),
};

export function FlightDeckExplorer({ projects }) {
  const reducedMotion = useReducedMotion();
  const [[index, direction], setIndexDirection] = useState([0, 0]);
  const [bankKey, setBankKey] = useState(0);
  const count = projects.length;

  useEffect(() => {
    setIndexDirection([0, 0]);
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
    if (nextIndex < 0 || nextIndex >= count || nextIndex === index) return;
    setIndexDirection([nextIndex, nextIndex > index ? 1 : -1]);
    setBankKey((k) => k + 1);
  }

  const project = projects[index];

  return (
    <div className="pb-8">
      <div className="relative mb-16 overflow-x-auto px-2 pb-2">
        <div className="relative min-w-[560px] sm:min-w-0">
          <div className="absolute left-0 right-0 top-[13px] h-px bg-border" />
          <motion.div
            className="absolute left-0 top-[13px] h-px origin-left bg-accent"
            animate={{ width: count > 1 ? `${(index / (count - 1)) * 100}%` : '0%' }}
            transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="relative flex justify-between">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`View ${p.title}`}
                aria-current={i === index}
                className="group relative flex flex-col items-center gap-2 px-1"
              >
                {i === index && (
                  <motion.div
                    layoutId="flight-deck-plane"
                    className="absolute -top-7"
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  >
                    <motion.span
                      key={bankKey}
                      initial={reducedMotion ? { rotate: 0 } : { rotate: direction * 16 }}
                      animate={{ rotate: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="block text-accent"
                    >
                      <Plane size={14} />
                    </motion.span>
                  </motion.div>
                )}
                <span
                  className={cn(
                    'h-2.5 w-2.5 rounded-full border-2 transition-colors duration-300',
                    i === index
                      ? 'border-accent bg-accent'
                      : 'border-border bg-background group-hover:border-foreground/40'
                  )}
                />
                <span
                  className={cn(
                    'font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300',
                    i === index ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={project.slug}
          custom={direction}
          variants={panelVariants}
          initial={reducedMotion ? 'center' : 'enter'}
          animate="center"
          exit={reducedMotion ? 'center' : 'exit'}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-8 lg:grid-cols-12 lg:items-center"
        >
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted">
              <Image src={project.hero_image} alt={project.title} className="h-full w-full" fittingType="fill" />
              <span className="absolute left-3 top-3 rounded-full border border-border bg-background/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] backdrop-blur">
                {project.category}
              </span>
              <CornerBrackets />
              {!reducedMotion && (
                <motion.div
                  key={`scan-${project.slug}`}
                  className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-accent/25 to-transparent"
                  initial={{ x: '-120%' }}
                  animate={{ x: '220%' }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                />
              )}
            </div>
          </div>

          <div className="lg:col-span-6">
            <span className="mono-label">
              Project · {String(index + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}
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
  );
}
