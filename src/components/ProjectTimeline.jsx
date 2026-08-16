import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ProjectCard } from '@/components/ProjectCard';
import { cn } from '@/lib/utils';

function TimelineEntry({ project, side }) {
  const isLeft = side === 'left';
  const reducedMotion = useReducedMotion();
  const offsetX = isLeft ? -32 : 32;

  const card = (
    <motion.div
      className={cn('w-full sm:w-4/5', isLeft && 'sm:ml-auto')}
      initial={reducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: offsetX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <ProjectCard project={project} />
    </motion.div>
  );

  return (
    <div className="relative">
      <div className="absolute left-4 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-background sm:left-1/2" />
      <div className="grid gap-6 pl-12 sm:grid-cols-2 sm:gap-16 sm:pl-0">
        {isLeft ? card : <div className="hidden sm:block" />}
        {isLeft ? <div className="hidden sm:block" /> : card}
      </div>
    </div>
  );
}

export function ProjectTimeline({ projects }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.75', 'end 0.25'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, restDelta: 0.001 });

  if (projects.length === 0) {
    return <p className="py-24 text-center text-muted-foreground">No projects in this category yet.</p>;
  }

  return (
    <div ref={containerRef} className="relative pb-8">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border sm:left-1/2" />
      <motion.div
        className="absolute left-4 top-0 w-px origin-top bg-accent sm:left-1/2"
        style={{ scaleY: progress, height: '100%' }}
      />
      <div className="flex flex-col gap-16 sm:gap-24">
        {projects.map((project, i) => (
          <TimelineEntry key={project.slug} project={project} side={i % 2 === 0 ? 'left' : 'right'} />
        ))}
      </div>
    </div>
  );
}
