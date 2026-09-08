import type { SectionMeta } from '@/types/content';

/**
 * Site-wide constants. Section order here drives both the router-less
 * scroll navigation and any future in-page progress indicator, so this
 * is the single place to reorder sections.
 */

export const SITE = {
  name: 'Crimson Sanctum',
  owner: 'Mohammad Hammad Sadiq',
  tagline: 'An Interactive Portfolio Experience',
  description:
    'The interactive portfolio of Mohammad Hammad Sadiq — BBA Finance student, building a professional foundation one honest step at a time.',
} as const;

export const SECTIONS: SectionMeta[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'projects', label: 'Projects / Work' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];
