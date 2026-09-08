import { Container } from '@/components/common/Container';
import { SITE } from '@/lib/constants';
import educationData from '@/data/education.json';

export function Footer() {
  const primaryEducation = educationData[0];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-charcoal-600/80 bg-charcoal-800 py-12 md:py-16">
      <Container className="flex flex-col items-center gap-4 text-center">
        <p className="font-display text-lg tracking-wide text-parchment">{SITE.owner}</p>
        {primaryEducation && (
          <p className="max-w-md text-sm leading-6 text-parchment-muted">
            {primaryEducation.program} {primaryEducation.specialization && `${primaryEducation.specialization},`}
            <br />
            {primaryEducation.institution}, Kanpur
          </p>
        )}
        <p className="font-utility text-xs tracking-[0.12em] text-parchment-faint">
          © {currentYear} {SITE.owner}.
        </p>
      </Container>
    </footer>
  );
}
