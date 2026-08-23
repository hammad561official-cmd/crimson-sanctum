import { Button } from '@/components/common/Button';
import { Container } from '@/components/common/Container';
import { SectionWrapper } from '@/components/common/SectionWrapper';
import contactData from '@/data/contact.json';

export function Contact() {
  return (
    <SectionWrapper id="contact" label="Contact" className="relative overflow-hidden">
      <Container className="relative space-y-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-ruby/55 to-transparent" />

        <header className="edge-lit-card edge-tier-2 mx-auto max-w-3xl rounded-sm border bg-charcoal-700/30 p-6 text-center md:p-8">
          <p className="font-utility text-xs uppercase tracking-[0.34em] text-crimson-ruby">Contact</p>
          <h2 className="mx-auto max-w-2xl font-display text-3xl leading-tight text-parchment md:text-5xl">
            {contactData.headline}
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-7 text-parchment-muted md:text-lg">
            {contactData.availability}
          </p>
        </header>

        <div className="flex justify-center">
          <Button as="a" href={contactData.resumePath} variant="ghost">
            View Resume
          </Button>
        </div>
      </Container>
    </SectionWrapper>
  );
}
