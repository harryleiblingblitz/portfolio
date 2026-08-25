import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Github, Linkedin } from 'lucide-react';
import { site } from '@/lib/siteConfig';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/cv', label: 'CV' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <>
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-[1px] origin-left bg-accent"
        style={{ scaleX: progress }}
      />
      <header className="fixed inset-x-0 top-0 z-40 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-8">
          <Link to="/" className="font-mono text-[13px] uppercase tracking-[0.18em] text-neutral-900">
            {site.fullName}<span className="text-accent">.</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative py-1 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300',
                    isActive ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-neutral-500 transition-colors duration-300 hover:text-neutral-900"
            >
              <Github size={16} />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-neutral-500 transition-colors duration-300 hover:text-neutral-900"
            >
              <Linkedin size={16} />
            </a>
            <ThemeToggle />
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center text-neutral-900 md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-neutral-200 bg-white px-5 py-6 md:hidden">
            <nav className="flex flex-col gap-5">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'font-mono text-sm uppercase tracking-[0.16em]',
                      isActive ? 'text-neutral-900' : 'text-neutral-500'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-2 flex items-center gap-4 border-t border-neutral-200 pt-5">
                <a href={site.github} target="_blank" rel="noreferrer" className="text-neutral-500">
                  <Github size={17} />
                </a>
                <a href={site.linkedin} target="_blank" rel="noreferrer" className="text-neutral-500">
                  <Linkedin size={17} />
                </a>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
