import { Helmet } from 'react-helmet-async';
import { buildMeta, type MetaInput } from '@/lib/seo';

/**
 * SEO — drop this once per route with page-specific title/description.
 * Falls back to site-wide defaults if nothing is passed, so pages that
 * forget to set it still render sane meta tags rather than none.
 */
export function SEO({ title, description }: MetaInput) {
  const meta = buildMeta({
    ...(title !== undefined ? { title } : {}),
    ...(description !== undefined ? { description } : {}),
  });

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
