// Auto-discovers every JSON file in ./projects — add a new project by
// dropping a new file in that folder, no import statements needed.
const modules = import.meta.glob('./projects/*.json', { eager: true });

const allProjects = Object.values(modules).map((mod) => mod.default ?? mod);

export function getAllProjects() {
  return [...allProjects].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}

export function getPublishedProjects() {
  return getAllProjects().filter((p) => p.status === 'published');
}

export function getProjectBySlug(slug) {
  return allProjects.find((p) => p.slug === slug) ?? null;
}
