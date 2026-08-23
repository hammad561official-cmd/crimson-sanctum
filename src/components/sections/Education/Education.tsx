import { Container } from '@/components/common/Container';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import educationData from '@/data/education.json';

export function Education() {
  return (
    <SectionWrapper id="education" label="Education" className="relative overflow-hidden">
      <Container className="relative space-y-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-ruby/55 to-transparent" />

        <header className="space-y-4">
          <p className="font-utility text-xs uppercase tracking-[0.34em] text-crimson-ruby">Education</p>
          <h2 className="max-w-2xl font-display text-3xl leading-tight text-parchment md:text-5xl">
            Academic foundation anchored in business and finance.
          </h2>
        </header>

        <div className="space-y-4">
          {educationData.map((entry) => (
            <article key={entry.id} className="edge-lit-card edge-tier-3 rounded-sm border bg-charcoal-700/35 p-6 backdrop-blur-sm">
              <p className="font-utility text-[11px] uppercase tracking-[0.24em] text-crimson-ruby">{entry.status}</p>
              <h3 className="mt-2 font-display text-2xl text-parchment">{entry.program}</h3>
              <p className="mt-2 text-base leading-7 text-parchment-muted">{entry.institution}</p>
            </article>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
