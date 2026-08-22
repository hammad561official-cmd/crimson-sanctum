import clsx, { type ClassValue } from 'clsx';

/**
 * cn — thin re-export of clsx for conditional Tailwind class composition.
 * Kept as its own module so the import path stays semantic (`@/lib/cn`)
 * and swapping the underlying implementation later (e.g. to tailwind-merge)
 * doesn't require touching every component.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs);
}
