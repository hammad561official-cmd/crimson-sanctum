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
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'current-works', label: 'Current Works & Future Ventures' },
  { id: 'education', label: 'Education' },
  { id: 'hall-of-achievement', label: 'Hall of Achievement' },
  { id: 'future-goals', label: 'Future Goals' },
  { id: 'contact', label: 'Contact' },
];
