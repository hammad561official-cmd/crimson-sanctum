import { useState } from 'react';
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
const skillCategories = Object.keys(groupedSkills);

export function Skills() {
  const [activeCategory, setActiveCategory] = useState('All');
  const visibleCategories =
    activeCategory === 'All' ? skillCategories : skillCategories.filter((category) => category === activeCategory);

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

        <div className="flex flex-wrap gap-2" aria-label="Filter skills">
          {['All', ...skillCategories].map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className="rounded-full border border-charcoal-500 bg-charcoal-700/60 px-4 py-2 text-sm text-parchment-muted transition-colors duration-300 hover:border-crimson-ruby hover:text-parchment aria-pressed:border-crimson-ruby aria-pressed:bg-crimson-deep/30 aria-pressed:text-parchment"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {visibleCategories.map((category) => {
            const entries = groupedSkills[category] ?? [];
            return (
            <section key={category} aria-label={category} className="edge-lit-card edge-tier-1 rounded-sm border bg-charcoal-700/34 p-5 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-display text-xl text-parchment">{category}</h3>
                <span className="font-utility text-[11px] uppercase tracking-[0.16em] text-parchment-faint">
                  {entries.length} skills
                </span>
              </div>
              <ul className="space-y-4">
                {entries.map((skill) => (
                  <li key={skill.id} className="space-y-1">
                    <p className="font-body text-base text-parchment">{skill.name}</p>
                    <p className="text-sm leading-6 text-parchment-muted">{skill.evidence}</p>
                  </li>
                ))}
              </ul>
            </section>
            );
          })}
        </div>
      </Container>
    </SectionWrapper>
  );
}
