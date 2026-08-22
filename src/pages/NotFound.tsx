import { Link } from 'react-router-dom';
import { SEO } from '@/components/layout/SEO';
import { Button } from '@/components/common/Button';
import { Container } from '@/components/common/Container';

/**
 * NotFound — minimal 404 page. Styled plainly on purpose; it inherits
 * the global obsidian/parchment palette but doesn't need the full
 * cinematic treatment of the main experience.
 */
export function NotFound() {
  return (
    <>
      <SEO title="Page not found" description="This chamber of the sanctum does not exist." />
      <Container className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
        <p className="font-utility text-sm uppercase tracking-widest2 text-parchment-faint">404</p>
        <h1 className="font-display text-4xl text-parchment">This chamber does not exist.</h1>
        <p className="max-w-md text-parchment-muted">
          The path you followed leads nowhere in the sanctum. Return to the entrance.
        </p>
        <Button as={Link} to="/" variant="primary">
          Return home
        </Button>
      </Container>
    </>
  );
}
