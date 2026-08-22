import { SITE } from '@/lib/constants';

export interface MetaInput {
  title?: string;
  description?: string;
}

export interface MetaOutput {
  title: string;
  description: string;
}

/**
 * buildMeta — returns a consistent meta object for a given page/route.
 * Keeps SEO copy centralized instead of scattered across page components.
 */
export function buildMeta({ title, description }: MetaInput = {}): MetaOutput {
  return {
    title: title ? `${title} | ${SITE.name}` : `${SITE.name} | ${SITE.owner}`,
    description: description ?? SITE.description,
  };
}
