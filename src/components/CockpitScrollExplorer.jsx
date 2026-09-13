import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Plane, ChevronDown } from 'lucide-react';

const VH_PER_PROJECT = 70;

// Each project holds full opacity across most of its own segment and only
// cross-dissolves with a neighbour in a short FADE-wide window centred on
// the boundary between them, so at most one pair is ever mid-transition
// and every other project is either fully shown or fully hidden.
const FADE = 0.2;
const HALF_PLATEAU = 0.5 - FADE / 2;

function projectStyle(floatIndex, i) {
  const diff = floatIndex - i;
  const dist = Math.abs(diff);
  const opacity =
    dist <= HALF_PLATEAU ? 1 : dist >= HALF_PLATEAU + FADE ? 0 : 1 - (dist - HALF_PLATEAU) / FADE;
  const translateY = Math.max(-1, Math.min(1, diff)) * -18;
  return { opacity, translateY };
}

export function CockpitScrollExplorer({ projects }) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const count = projects.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const zoomScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);

  const [floatIndex, setFloatIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    setFloatIndex(progress * (count - 1));
  });

  const activeIndex = Math.min(count - 1, Math.max(0, Math.round(floatIndex)));
  const activeProject = projects[activeIndex];

  if (count === 0) {
    return <p className="py-24 text-center text-muted-foreground">No projects to show yet.</p>;
  }

  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
      <section ref={sectionRef} className="relative" style={{ height: `${count * VH_PER_PROJECT}vh` }}>
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-black">
          <motion.img
            src="/images/cockpit/cockpit-pov.jpg"
            alt="Airliner cockpit"
            className="absolute inset-0 h-full w-full object-cover"
            style={reducedMotion ? undefined : { scale: zoomScale }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

          <div className="relative z-10 flex h-full w-full items-end">
            <div className="mx-auto w-full max-w-[1400px] px-5 pb-20 pt-6 sm:px-8 sm:pb-28">
              <div className="relative min-h-[320px] overflow-hidden sm:min-h-[260px]">
                {projects.map((project, i) => {
                  const { opacity, translateY } = projectStyle(floatIndex, i);
                  if (opacity < 0.01) return null;
                  return (
                    <div
                      key={project.slug}
                      className="absolute inset-0 max-w-2xl"
                      style={{ opacity, transform: `translateY(${translateY}px)`, pointerEvents: 'none' }}
                    >
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
                        {project.category}
                      </span>
                      <h3 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-5xl">
                        {project.title}
                      </h3>
                      <p className="mt-4 line-clamp-2 max-w-xl text-white/80">{project.short_description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center gap-4">
                <Link
                  to={`/projects/${activeProject.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black"
                >
                  View project
                  <Plane size={15} />
                </Link>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          <motion.div
            style={{ opacity: hintOpacity }}
            className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown size={18} />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
