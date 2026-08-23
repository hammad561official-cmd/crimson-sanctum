import { Container } from '@/components/common/Container';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import worksData from '@/data/currentWorks.json';

const currentWorks = worksData.filter((entry) => entry.track === 'current');
const futureVentures = worksData.filter((entry) => entry.track === 'future');

export function CurrentWorks() {
  return (
    <SectionWrapper id="current-works" label="Current Works & Future Ventures" className="relative overflow-hidden">
      <Container className="relative space-y-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-ruby/55 to-transparent" />

        <header className="space-y-4">
          <p className="font-utility text-xs uppercase tracking-[0.34em] text-crimson-ruby">
            Projects · Current Works & Future Ventures
          </p>
          <h2 className="max-w-3xl font-display text-3xl leading-tight text-parchment md:text-5xl">
            Work in motion today, and structured space for verified ventures tomorrow.
          </h2>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <section aria-label="Current works" className="space-y-4">
            <h3 className="font-display text-2xl text-parchment">Current works</h3>
            {currentWorks.map((work) => (
              <article key={work.id} className="rounded-sm border border-charcoal-500 bg-charcoal-700/35 p-5 backdrop-blur-sm">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                  <h4 className="font-display text-xl text-parchment">{work.title}</h4>
                  <span className="rounded-sm border border-crimson-ruby/50 px-2 py-1 font-utility text-[11px] uppercase tracking-[0.2em] text-crimson-ruby">
                    {work.status}
                  </span>
                </div>
                <p className="text-sm leading-7 text-parchment-muted">{work.summary}</p>
              </article>
            ))}
          </section>

          <section aria-label="Future ventures" className="space-y-4">
            <h3 className="font-display text-2xl text-parchment">Future ventures</h3>
            {futureVentures.map((venture) => (
              <article key={venture.id} className="rounded-sm border border-charcoal-500 bg-charcoal-700/35 p-5 backdrop-blur-sm">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                  <h4 className="font-display text-xl text-parchment">{venture.title}</h4>
                  <span className="rounded-sm border border-crimson-ruby/50 px-2 py-1 font-utility text-[11px] uppercase tracking-[0.2em] text-crimson-ruby">
                    {venture.status}
                  </span>
                </div>
                <p className="text-sm leading-7 text-parchment-muted">{venture.summary}</p>
              </article>
            ))}
          </section>
        </div>
      </Container>
    </SectionWrapper>
  );
}
