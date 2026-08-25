import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const VIDEO_SRC = '/videos/hero-takeoff.mp4';
const POSTER_SRC = '/videos/hero-takeoff-poster.jpg';

// Pins a full-screen video in place while the section scrolls past, and maps
// scroll progress directly onto the video's currentTime so the takeoff plays
// frame-by-frame with the scroll wheel instead of on a timer. The hero copy
// (passed in as children) fades in once the plane has cleared the frame.
export function ScrollPlaneHero({ children }) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const textOpacity = useTransform(scrollYProgress, [0.6, 0.78], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.6, 0.78], [28, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reducedMotion) return;

    const onLoaded = () => setDuration(el.duration || 0);
    el.addEventListener('loadedmetadata', onLoaded);
    // Metadata can arrive before this effect attaches the listener (the
    // video starts loading as soon as it's rendered), so check directly too.
    if (el.readyState >= 1 && el.duration) onLoaded();

    // iOS Safari won't paint a seeked frame until the video has played at
    // least once. Muted autoplay is allowed without a user gesture, so we
    // start it and immediately pause to "prime" the decoder for scrubbing.
    el.play()
      .then(() => el.pause())
      .catch(() => {});

    return () => el.removeEventListener('loadedmetadata', onLoaded);
  }, [reducedMotion]);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const el = videoRef.current;
    if (!el || !duration || reducedMotion) return;
    const time = progress * duration;
    if (Number.isFinite(time)) el.currentTime = time;
  });

  if (reducedMotion) {
    return (
      <div className="relative -mt-32 h-[70vh] min-h-[520px] w-full overflow-hidden sm:-mt-40 sm:h-[85vh]">
        <img
          src={POSTER_SRC}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative z-10 flex h-full w-full items-end">
          <div className="mx-auto w-full max-w-[1400px] px-5 pb-16 pt-6 sm:px-8 sm:pb-24">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section ref={sectionRef} className="relative -mt-32 h-[240vh] sm:-mt-40">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster={POSTER_SRC}
          width={864}
          height={496}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />

        <div className="relative z-10 flex h-full w-full items-end">
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="mx-auto w-full max-w-[1400px] px-5 pb-16 pt-6 sm:px-8 sm:pb-24"
          >
            {children}
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-white/70"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
