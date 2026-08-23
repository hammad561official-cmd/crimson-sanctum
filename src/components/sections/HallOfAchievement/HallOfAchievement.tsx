import { Container } from '@/components/common/Container';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import certificatesData from '@/data/certificates.json';

export function HallOfAchievement() {
  return (
    <SectionWrapper id="hall-of-achievement" label="Hall of Achievement" className="relative overflow-hidden">
      <Container className="relative space-y-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-ruby/55 to-transparent" />

        <header className="space-y-4">
          <p className="font-utility text-xs uppercase tracking-[0.34em] text-crimson-ruby">Hall of Achievement</p>
          <h2 className="max-w-3xl font-display text-3xl leading-tight text-parchment md:text-5xl">
            Verified recognitions collected along the journey.
          </h2>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {certificatesData.map((certificate) => (
            <article key={certificate.id} className="edge-lit-card edge-tier-1 rounded-sm border bg-charcoal-700/34 p-5 backdrop-blur-sm">
              <h3 className="font-display text-xl text-parchment">{certificate.title}</h3>

              {certificate.type && (
                <p className="mt-2 text-sm leading-6 text-parchment-muted">{certificate.type}</p>
              )}

              {certificate.description && (
                <p className="mt-2 text-sm leading-6 text-parchment-muted">{certificate.description}</p>
              )}

              <div className="mt-3 space-y-1 text-sm text-parchment-muted">
                {certificate.issuer && <p>Issuer: {certificate.issuer}</p>}
                {certificate.platform && <p>Platform: {certificate.platform}</p>}
                {certificate.organizedBy && <p>Organized by: {certificate.organizedBy}</p>}
                {certificate.inPartnershipWith && <p>In partnership with: {certificate.inPartnershipWith}</p>}
                {certificate.institution && <p>Institution: {certificate.institution}</p>}
                {certificate.topic && <p>Topic: {certificate.topic}</p>}
              </div>

              {certificate.date && (
                <p className="mt-2 font-utility text-[11px] uppercase tracking-[0.2em] text-parchment-faint">
                  {certificate.date}
                </p>
              )}
            </article>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
