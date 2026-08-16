import { Link } from 'react-router-dom';
import { site } from '@/lib/siteConfig';
import { SectionLabel } from '@/components/SectionLabel';
import { Reveal } from '@/components/Reveal';
import { Image } from '@/components/ui/image';

const skillGroups = [
  { title: 'Programming Languages', items: ['MATLAB', 'Python', 'Microsoft Excel'] },
  { title: 'CAD Software', items: ['Siemens NX', 'Autodesk Inventor', 'STAR-CCM+'] },
  { title: 'Simulation Software', items: ['STAR-CCM+', 'Simulink', 'Arduino Uno'] },
  { title: 'Soft Skills', items: ['Rapport building', 'Communication', 'Collaborative problem solving'] },
];

const education = [
  {
    title: 'BEng Aerospace Engineering, With Professional Placement',
    place: 'University of Bath — Predicted First Class',
    period: 'Oct 2023 – Jun 2027',
  },
];

const extracurricular = [
  'Young Professional Ambassador for the IET and STEM Learning UK',
  'Founder/Chair of Spikeball Sports Club at the University of Bath — 40+ members, competed in national tournaments',
  'Events Organiser for Rolls-Royce, arranging socials, sports and activities for 500+ members',
  'Editor and Coordinator of School Newsletter — compiled and distributed articles from a team of 20 students',
];

export default function About() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <Reveal>
        <SectionLabel index="00" className="mb-16 max-w-md">
          Profile
        </SectionLabel>
      </Reveal>

      <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
        <Reveal className="lg:col-span-7">
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            {site.fullName}
          </h1>
          <div className="mt-8 space-y-5 text-lg text-muted-foreground">
            <p>
              I'm an Aerospace Engineering student at the University of Bath. I've just finished a
              placement year at Rolls-Royce, working across cryogenic fuel systems and turbine
              aerothermal CFD. Before that I worked in engineering operations at Roboteam, testing
              and maintaining unmanned robots.
            </p>
            <p>
              I'm interested in the intersection between innovation and sustainability, and
              working collaboratively to make the world a better place.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {site.cvUrl ? (
              <Link
                to="/cv"
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background"
              >
                View CV
              </Link>
            ) : (
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background"
              >
                Request CV
              </a>
            )}
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium hover:border-foreground/30"
            >
              LinkedIn
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-5">
          <div className="aspect-[4/5] w-[49%] overflow-hidden rounded-lg border border-border bg-muted">
            <Image
              src="/images/about/portrait-about.jpg"
              alt={site.fullName}
              className="h-full w-full"
              fittingType="fill"
            />
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-24 border-t border-border pt-10">
        <span className="font-mono text-[11px] text-accent">01</span>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">Education</h2>
        <div className="mt-6 space-y-6">
          {education.map((entry) => (
            <div key={entry.title} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="font-medium">{entry.title}</p>
                <p className="text-sm text-muted-foreground">{entry.place}</p>
              </div>
              <span className="mono-label">{entry.period}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mt-16 border-t border-border pt-10">
        <span className="font-mono text-[11px] text-accent">02</span>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">Technical skills</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <div key={group.title}>
              <p className="mono-label mb-3">{group.title}</p>
              <ul className="space-y-1.5 text-sm text-foreground/85">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mt-16 border-t border-border pt-10">
        <span className="font-mono text-[11px] text-accent">03</span>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">Extracurricular</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {extracurricular.map((item) => (
            <div key={item} className="rounded-lg border border-border p-5 text-sm">
              {item}
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mt-16 border-t border-border pb-8 pt-10">
        <span className="font-mono text-[11px] text-accent">04</span>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">What's next</h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Finishing my degree at the University of Bath, then open to graduate opportunities in
          aerospace, mechanical, and medical-device engineering — continuing to build toward
          roles that combine hands-on hardware work with simulation and software.
        </p>
      </Reveal>
    </div>
  );
}
