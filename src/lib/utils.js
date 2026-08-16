import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function createPageUrl(pageName) {
  const map = {
    Home: '/',
    Projects: '/projects',
    About: '/about',
    Contact: '/contact',
  };
  return map[pageName] || '/';
}
