import { useState } from 'react';
import { CrimsonLightningBackground } from '@/components/background/CrimsonLightningBackground';
import { SEO } from '@/components/layout/SEO';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { About } from '@/components/sections/About';
import { IntroAnimation } from '@/components/sections/Hero/IntroAnimation';
import { Hero } from '@/components/sections/Hero';

/**
 * Home
 *
 * Current milestone: Foundation + Awakening + Hero orchestration.
 * The cinematic FirstChamber presentation will be injected into Hero once
 * that component is approved. Until then Hero uses its safe fallback path.
 */
export function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      <CrimsonLightningBackground />
      <SEO />

      <LoadingScreen
        isReady={introComplete}
        onComplete={() => setIntroComplete(true)}
      >
        <IntroAnimation
          playing={!introComplete}
          onSequenceComplete={() => setIntroComplete(true)}
        />
      </LoadingScreen>

      <Hero active={introComplete} />

      {introComplete && <About />}
    </>
  );
}
