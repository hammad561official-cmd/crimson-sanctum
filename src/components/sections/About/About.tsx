import { motion } from 'framer-motion';
import { Container } from '@/components/common/Container';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import { SITE } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { fadeUp, fadeUpReduced, staggerContainer } from '@/lib/animationVariants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { AboutAtmosphere } from './AboutAtmosphere';

const aboutPillars = [
  {
    title: 'Measured craft',
    description:
      'Every touchpoint is designed to feel intentional: quiet decisions, clear hierarchy, and a deliberate sense of atmosphere.',
  },
  {
    title: 'Strategic clarity',
    description:
      'The work balances creative expression with useful structure, turning complex information into clear, confident experiences.',
  },
  {
    title: 'Cinematic restraint',
    description:
      'Motion is used with purpose. The interface stays premium and readable while letting the story unfold at the right pace.',
  },
  {
    title: 'Long-horizon thinking',
    description:
      'The portfolio is designed to grow with the person behind it — structured enough for accuracy, expressive enough to leave a mark.',
  },
] as const;

export function About() {
  const prefersReducedMotion = useReducedMotion();
  const entryVariants = prefersReducedMotion ? fadeUpReduced : fadeUp;
  const stagger = staggerContainer(0.12);

  return (
    <SectionWrapper id="about" label="About" className="relative overflow-hidden">
      <AboutAtmosphere />
      <Container className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-ruby/60 to-transparent" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          variants={stagger}
          className="grid gap-10 md:grid-cols-[1.1fr_1.4fr] md:items-start"
        >
          <motion.div variants={entryVariants} className="space-y-6">
            <p className="font-utility text-xs uppercase tracking-[0.38em] text-crimson-ruby">About</p>

            <h2 className="max-w-xl font-display text-3xl leading-tight text-parchment md:text-5xl">
              A portfolio shaped like a chamber: quiet, deliberate, and immersive.
            </h2>

            <div className="space-y-4 text-base leading-7 text-parchment-muted md:text-lg">
              <p>
                {SITE.name} presents a focused professional story with atmosphere, structure, and honesty at its core.
              </p>
              <p>
                The goal is not noise or embellishment. It is to create a premium digital experience that makes the work easier to trust, easier to remember, and easier to understand.
              </p>
            </div>
          </motion.div>

          <motion.div variants={entryVariants} className="grid gap-4 sm:grid-cols-2">
            {aboutPillars.map((pillar) => (
              <motion.article
                key={pillar.title}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                whileHover={prefersReducedMotion ? { y: 0, scale: 1 } : { y: -4, scale: 1.01 }}
                className={cn(
                  'group rounded-sm border border-charcoal-500 bg-charcoal-700/40 p-5 backdrop-blur-sm',
                  'transition-colors duration-300 hover:border-crimson-ruby/80 hover:bg-charcoal-700'
                )}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm border border-crimson-ruby/60 bg-crimson-deep/20 text-sm font-medium text-crimson-ruby">
                  0{aboutPillars.indexOf(pillar) + 1}
                </div>

                <h3 className="mb-3 font-display text-xl text-parchment">{pillar.title}</h3>
                <p className="text-sm leading-6 text-parchment-muted">{pillar.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </SectionWrapper>
  );
}
