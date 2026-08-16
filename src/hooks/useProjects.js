// Data is bundled at build time from src/data/projects, so these hooks
// resolve synchronously — isLoading is always false. The {data, isLoading}
// shape is kept identical to a real async fetch so this file is the only
// place that would need to change if project data ever moves to a backend.
import { getPublishedProjects, getProjectBySlug } from '@/data/projects';

export function useProjects() {
  return { data: getPublishedProjects(), isLoading: false };
}

export function useProjectBySlug(slug) {
  const data = slug ? getProjectBySlug(slug) : null;
  return { data, isLoading: false };
}
