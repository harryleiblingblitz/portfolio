import { useState } from 'react';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { site } from '@/lib/siteConfig';
import { SectionLabel } from '@/components/SectionLabel';
import { Reveal } from '@/components/Reveal';

const contactLinks = [
  { icon: Mail, label: site.email, href: `mailto:${site.email}` },
  { icon: Linkedin, label: 'LinkedIn', href: site.linkedin },
  { icon: Github, label: 'GitHub', href: site.github },
  { icon: MapPin, label: site.location, href: null },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name || 'a visitor'}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <Reveal>
        <SectionLabel index="✕" className="mb-16 max-w-md">
          Contact
        </SectionLabel>
      </Reveal>

      <div className="grid gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Let's talk.
          </h1>
          <p className="mt-6 max-w-md text-muted-foreground">
            Open to graduate opportunities in aerospace, mechanical, and medical-device
            engineering. Feel free to reach out directly.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {contactLinks.map(({ icon: Icon, label, href }) =>
              href ? (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  className="inline-flex items-center gap-3 text-sm text-foreground/85 hover:text-foreground"
                >
                  <Icon size={16} className="text-accent" />
                  {label}
                </a>
              ) : (
                <span key={label} className="inline-flex items-center gap-3 text-sm text-foreground/85">
                  <Icon size={16} className="text-accent" />
                  {label}
                </span>
              )
            )}
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border p-8">
            <div>
              <label className="mono-label mb-2 block">Name</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mono-label mb-2 block">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mono-label mb-2 block">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background"
            >
              Send message
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
