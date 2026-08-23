import { Container } from '@/components/common/Container';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import futureGoalsData from '@/data/futureGoals.json';

export function FutureGoals() {
  return (
    <SectionWrapper id="future-goals" label="Future Goals" className="relative overflow-hidden">
      <Container className="relative space-y-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-ruby/55 to-transparent" />

        <header className="space-y-4">
          <p className="font-utility text-xs uppercase tracking-[0.34em] text-crimson-ruby">Future Goals</p>
          <h2 className="max-w-3xl font-display text-3xl leading-tight text-parchment md:text-5xl">
            Planned steps for what the sanctum becomes next.
          </h2>
        </header>

        <ol className="space-y-4">
          {futureGoalsData.map((goal, index) => (
            <li
              key={goal.id}
              className={index === 0
                ? 'edge-lit-card edge-tier-2 rounded-sm border bg-charcoal-700/34 p-5 backdrop-blur-sm'
                : 'edge-lit-card edge-tier-1 rounded-sm border bg-charcoal-700/34 p-5 backdrop-blur-sm'}
            >
              <p className="font-utility text-[11px] uppercase tracking-[0.22em] text-crimson-ruby">Step 0{index + 1} · {goal.status}</p>
              <h3 className="mt-2 font-display text-xl text-parchment">{goal.title}</h3>
              <p className="mt-2 text-sm leading-7 text-parchment-muted">{goal.detail}</p>
            </li>
          ))}
        </ol>
      </Container>
    </SectionWrapper>
  );
}
