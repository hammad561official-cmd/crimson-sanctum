import { Container } from '@/components/common/Container';
import { SITE } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-charcoal-600/80 py-8">
      <Container className="flex flex-col items-center gap-3 text-center">
        <p className="font-display text-lg text-parchment">{SITE.owner}</p>
        <p className="text-sm text-parchment-muted">
          {SITE.tagline}
        </p>
        <p className="font-utility text-xs uppercase tracking-[0.2em] text-parchment-faint">
          {currentYear} · {SITE.name}
        </p>
      </Container>
    </footer>
  );
}
