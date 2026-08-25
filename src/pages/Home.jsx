import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, MapPin } from 'lucide-react';
import { site } from '@/lib/siteConfig';
import { useProjects } from '@/hooks/useProjects';
import { useIntroPlayback } from '@/lib/useIntroPlayback';
import { BlueprintBackdrop } from '@/components/BlueprintBackdrop';
import { ScrollPlaneHero } from '@/components/ScrollPlaneHero';
import { FeaturedMarquee } from '@/components/FeaturedMarquee';
import { Image } from '@/components/ui/image';
import { SectionLabel } from '@/components/SectionLabel';
import { Reveal } from '@/components/Reveal';

// Set to 'classic' to instantly revert the landing hero to the original
// static cutting-mat background with no video, no scroll-scrub, no reveal.
const HERO_VARIANT = 'scrollVideo';

export default function Home() {
  const { data: projects } = useProjects();
  const playIntro = useIntroPlayback();
  const featured = projects.filter((p) => p.featured).slice(0, 4);
  const featuredList = featured.length ? featured : projects.slice(0, 4);

  return (
    <div>
      {HERO_VARIANT === 'scrollVideo' ? (
        <ScrollPlaneHero>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
            <MapPin size={11} />
            {site.location}
          </div>

          <h1 className="text-balance text-[15vw] font-semibold leading-[0.92] tracking-tight text-white drop-shadow-sm sm:text-7xl lg:whitespace-nowrap lg:text-[6.5rem]">
            {site.fullName}
          </h1>
          <p className="mt-3 max-w-xl font-mono text-[13px] uppercase tracking-[0.14em] text-white/70">
            {site.role}
          </p>
          <p className="mt-3 max-w-lg text-lg text-white/80">{site.tagline}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black"
            >
              Explore projects
              <Plane size={15} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-black/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/60"
            >
              About me
            </Link>
          </div>
        </ScrollPlaneHero>
      ) : (
        <BlueprintBackdrop>
          <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-6 sm:px-8 sm:pb-40">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <MapPin size={11} />
              {site.location}
            </div>

            {/* CSS grid-stack: text and portrait share the same cell, so the row
                height is the max of the two instead of the two stacking additively. */}
            <div className="grid">
              <div className="col-start-1 row-start-1">
                <h1 className="text-balance text-[15vw] font-semibold leading-[0.92] tracking-tight sm:text-7xl lg:whitespace-nowrap lg:text-[6.5rem]">
                  {site.fullName}
                </h1>
                <p className="mt-3 max-w-xl font-mono text-[13px] uppercase tracking-[0.14em] text-muted-foreground">
                  {site.role}
                </p>
                <p className="mt-3 max-w-lg text-lg text-muted-foreground">{site.tagline}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background"
                  >
                    Explore projects
                    <Plane size={15} />
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-colors duration-300 hover:border-foreground/30"
                  >
                    About me
                  </Link>
                </div>
              </div>

              <motion.div
                className="col-start-1 row-start-1 hidden aspect-[3/4] self-start justify-self-end overflow-hidden rounded-lg border border-border bg-muted lg:block lg:w-[30%]"
                initial={playIntro ? { opacity: 0, scale: 1.04, x: 38 } : { opacity: 1, scale: 1, x: 38 }}
                animate={{ opacity: 1, scale: 1, x: 38 }}
                transition={{ duration: 0.9, delay: playIntro ? 0.3 : 0, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="/images/about/portrait.jpg"
                  alt={site.fullName}
                  className="h-full w-full"
                  fittingType="fill"
                />
              </motion.div>
            </div>
          </div>
        </BlueprintBackdrop>
      )}

      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:py-32">
        <Reveal>
          <SectionLabel index="01" className="mb-16 max-w-md">
            Featured work
          </SectionLabel>
        </Reveal>

        <Reveal delay={0.05}>
          <FeaturedMarquee projects={featuredList} />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16 text-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-mono text-[12px] uppercase tracking-[0.16em] transition-all duration-300 hover:gap-3 hover:border-foreground/30"
            >
              Explore more
              <Plane size={14} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
