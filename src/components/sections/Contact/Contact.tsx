import { Container } from '@/components/common/Container';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import contactData from '@/data/contact.json';

export function Contact() {
  const hasEmail = typeof contactData.email === 'string' && contactData.email.length > 0;
  const hasGithub = typeof contactData.github === 'string' && contactData.github.length > 0;

  return (
    <SectionWrapper id="contact" label="Contact" className="relative overflow-hidden">
      <Container className="relative space-y-8">
        <header className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="font-utility text-xs uppercase tracking-[0.34em] text-crimson-ruby">Contact</p>
          <h2 className="font-display text-3xl leading-tight text-parchment md:text-5xl">
            {contactData.headline}
          </h2>
          <p className="text-base leading-7 text-parchment-muted md:text-lg">
            {contactData.availability}
          </p>
        </header>

        <nav aria-label="Contact links" className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {hasEmail && (
            <a
              href={`mailto:${contactData.email}`}
              className="border-b border-charcoal-500 pb-1 text-sm font-medium text-parchment transition-colors duration-300 hover:border-crimson-ruby hover:text-crimson-ruby"
            >
              Email
            </a>
          )}

          {hasGithub && (
            <a
              href={contactData.github}
              target="_blank"
              rel="noreferrer"
              className="border-b border-charcoal-500 pb-1 text-sm font-medium text-parchment transition-colors duration-300 hover:border-crimson-ruby hover:text-crimson-ruby"
            >
              GitHub
            </a>
          )}

          <a
            href={contactData.resumePath}
            className="border-b border-charcoal-500 pb-1 text-sm font-medium text-parchment transition-colors duration-300 hover:border-crimson-ruby hover:text-crimson-ruby"
          >
            Resume
          </a>
        </nav>
      </Container>
    </SectionWrapper>
  );
}
