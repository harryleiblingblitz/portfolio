import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const SESSION_KEY = 'harry-intro-played';

// Plays the homepage draw-in once per browser session (and never for
// prefers-reduced-motion) so repeat visits and back-navigation don't replay it.
export function useIntroPlayback() {
  const reducedMotion = useReducedMotion();
  const [skipIntro] = useState(() => {
    if (typeof window === 'undefined') return true;
    return Boolean(sessionStorage.getItem(SESSION_KEY));
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, '1');
    }
  }, []);

  return !reducedMotion && !skipIntro;
}
