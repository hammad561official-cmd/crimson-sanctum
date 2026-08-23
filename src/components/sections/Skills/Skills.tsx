import { Container } from '@/components/common/Container';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import skillsData from '@/data/skills.json';

const groupedSkills = skillsData.reduce<Record<string, typeof skillsData>>((result, entry) => {
  if (!result[entry.category]) {
    result[entry.category] = [];
  }
  result[entry.category]?.push(entry);
  return result;
}, {});

export function Skills() {
  return (
    <SectionWrapper id="skills" label="Skills" className="relative overflow-hidden">
      <Container className="relative space-y-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-ruby/55 to-transparent" />

        <header className="space-y-4">
          <p className="font-utility text-xs uppercase tracking-[0.34em] text-crimson-ruby">Skills & Tech Stack</p>
          <h2 className="max-w-2xl font-display text-3xl leading-tight text-parchment md:text-5xl">
            Finance-rooted discipline supported by a modern implementation stack.
          </h2>
        </header>

        <div className="grid gap-5 lg:grid-cols-3">
          {Object.entries(groupedSkills).map(([category, entries]) => (
            <section key={category} aria-label={category} className="edge-lit-card edge-tier-1 rounded-sm border bg-charcoal-700/34 p-5 backdrop-blur-sm">
              <h3 className="mb-4 font-display text-xl text-parchment">{category}</h3>
              <ul className="space-y-4">
                {entries.map((skill) => (
                  <li key={skill.id} className="space-y-1">
                    <p className="font-body text-base text-parchment">{skill.name}</p>
                    <p className="text-sm leading-6 text-parchment-muted">{skill.evidence}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
