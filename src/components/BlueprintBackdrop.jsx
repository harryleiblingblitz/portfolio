import { motion } from 'framer-motion';
import { useIntroPlayback } from '@/lib/useIntroPlayback';

const CONTENT_DELAY = 1.2;

// Full-bleed cutting-mat texture + watermark behind the hero, with the
// hero content itself fading/settling in once the aerofoil has drawn.
export function BlueprintBackdrop({ children }) {
  const playIntro = useIntroPlayback();

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="cutting-mat pointer-events-none absolute inset-0"
        initial={playIntro ? { opacity: 0 } : { opacity: 0.6 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.2, delay: playIntro ? 0.2 : 0, ease: 'easeOut' }}
      />

      <div className="pause-on-hover pointer-events-none absolute inset-x-0 top-[8%] overflow-hidden opacity-[0.04] sm:top-[10%]">
        <div className="marquee-track flex whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="mx-6 font-heading text-[22vw] font-semibold leading-none tracking-tight"
            >
              AEROSPACE ENGINEERING
            </span>
          ))}
        </div>
      </div>

      <motion.div
        initial={playIntro ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: playIntro ? CONTENT_DELAY : 0, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  );
}
