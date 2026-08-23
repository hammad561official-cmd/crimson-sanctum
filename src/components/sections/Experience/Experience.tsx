import { Container } from '@/components/common/Container';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import experienceData from '@/data/experience.json';

const labels: Record<string, string> = {
  freelance: 'Freelance',
  speaking: 'Speaking',
  other: 'Other',
};

export function Experience() {
  return (
    <SectionWrapper id="experience" label="Experience" className="relative overflow-hidden">
      <Container className="relative space-y-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-ruby/55 to-transparent" />

        <header className="space-y-4">
          <p className="font-utility text-xs uppercase tracking-[0.34em] text-crimson-ruby">Experience</p>
          <h2 className="max-w-2xl font-display text-3xl leading-tight text-parchment md:text-5xl">
            Practical work that builds financial discipline and communication confidence.
          </h2>
        </header>

        <div className="grid gap-4">
          {experienceData.map((entry, index) => (
            <article
              key={entry.id}
              className={index === 0
                ? 'edge-lit-card edge-tier-3 rounded-sm border bg-charcoal-700/36 p-6 backdrop-blur-sm'
                : 'edge-lit-card edge-tier-2 rounded-sm border bg-charcoal-700/36 p-6 backdrop-blur-sm'}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl text-parchment">{entry.title}</h3>
                <span className="rounded-sm border border-crimson-ruby/50 px-2 py-1 font-utility text-[11px] uppercase tracking-[0.2em] text-crimson-ruby">
                  {labels[entry.type] ?? labels.other}
                </span>
              </div>
              <p className="text-base leading-7 text-parchment-muted">{entry.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
