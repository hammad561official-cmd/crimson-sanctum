import { useState } from 'react';
import { CrimsonLightningBackground } from '@/components/background/CrimsonLightningBackground';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/layout/SEO';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { CurrentWorks } from '@/components/sections/CurrentWorks';
import { Education } from '@/components/sections/Education';
import { HallOfAchievement } from '@/components/sections/HallOfAchievement';
import { IntroAnimation } from '@/components/sections/Hero/IntroAnimation';
import { Hero } from '@/components/sections/Hero';
import { Skills } from '@/components/sections/Skills';

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
        isReady
        onComplete={() => setIntroComplete(true)}
      >
        <IntroAnimation
          playing={!introComplete}
          onSequenceComplete={() => setIntroComplete(true)}
        />
      </LoadingScreen>

      <Hero active={introComplete} />

      {introComplete && (
        <>
          <About />
          <Education />
          <Skills />
          <HallOfAchievement sectionId="certifications" sectionLabel="Certifications" variant="certifications" />
          <CurrentWorks />
          <HallOfAchievement sectionId="achievements" sectionLabel="Achievements" variant="achievements" />
          <Contact />
          <Footer />
        </>
      )}
    </>
  );
}
