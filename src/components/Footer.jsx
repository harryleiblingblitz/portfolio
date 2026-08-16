import { Link } from 'react-router-dom';
import { site } from '@/lib/siteConfig';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-mono text-[13px] uppercase tracking-[0.18em]">
              {site.fullName}<span className="text-accent">.</span>
            </p>
          </div>

          <div>
            <p className="mono-label mb-3">Navigate</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/projects" className="text-foreground/80 hover:text-foreground">Projects</Link>
              <Link to="/about" className="text-foreground/80 hover:text-foreground">About</Link>
              <Link to="/contact" className="text-foreground/80 hover:text-foreground">Contact</Link>
            </div>
          </div>

          <div>
            <p className="mono-label mb-3">Contact</p>
            <div className="flex flex-col gap-2 text-sm">
              <a href={`mailto:${site.email}`} className="text-foreground/80 hover:text-foreground">
                {site.email}
              </a>
              <a href={site.linkedin} target="_blank" rel="noreferrer" className="text-foreground/80 hover:text-foreground">
                LinkedIn
              </a>
              <a href={site.github} target="_blank" rel="noreferrer" className="text-foreground/80 hover:text-foreground">
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} {site.fullName}</span>
          <span className="font-mono">Bath, United Kingdom</span>
        </div>
      </div>
    </footer>
  );
}
