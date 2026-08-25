import { site } from '@/lib/siteConfig';
import { SectionLabel } from '@/components/SectionLabel';
import { Reveal } from '@/components/Reveal';

export default function CV() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <Reveal>
        <SectionLabel index="CV" className="mb-16 max-w-md">
          Curriculum Vitae
        </SectionLabel>
      </Reveal>

      <Reveal>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {site.fullName}
        </h1>
        <p className="mt-4 text-muted-foreground">
          Please find below my CV — references available on request.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-10 overflow-hidden rounded-lg border border-border">
        <img src="/images/cv.png" alt={`${site.fullName} CV`} className="w-full" />
      </Reveal>

      <Reveal delay={0.08} className="mt-6">
        <a
          href={site.cvUrl}
          download
          className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium hover:border-foreground/30"
        >
          Download PDF
        </a>
      </Reveal>
    </div>
  );
}
