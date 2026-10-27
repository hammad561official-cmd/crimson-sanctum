import { useEffect, useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/layout/SEO';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { CurrentWorks } from '@/components/sections/CurrentWorks';
import { Education } from '@/components/sections/Education';
import { HallOfAchievement } from '@/components/sections/HallOfAchievement';
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
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('locked', introVisible);
    const timer = window.setTimeout(() => setIntroVisible(false), 1400);

    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove('locked');
    };
  }, [introVisible]);

  return (
    <>
      <SEO />

      {introVisible && (
        <div className="reference-intro" role="dialog" aria-modal="true" aria-label="Crimson Sanctum introduction">
          <button
            type="button"
            className="reference-intro-skip"
            onClick={() => setIntroVisible(false)}
          >
            Skip intro
          </button>
          <div className="reference-intro-inner">
            <p>Loading Crimson Sanctum</p>
            <h1>
              <span>Crimson</span> <em>Sanctum</em>
            </h1>
            <i>An Interactive Portfolio Experience</i>
            <div className="reference-intro-bar" aria-hidden="true">
              <span />
            </div>
          </div>
        </div>
      )}

      <Hero active={!introVisible} />

      <div className="reference-marquee" aria-hidden="true">
        <div>
          {['Finance', 'Marketing', 'Business', 'Communication', 'Crimson Sanctum'].map((word) => (
            <span key={word}>{word}</span>
          ))}
          {['Finance', 'Marketing', 'Business', 'Communication', 'Crimson Sanctum'].map((word) => (
            <span key={`${word}-repeat`}>{word}</span>
          ))}
        </div>
      </div>
      <About />
      <Education />
      <Skills />
      <HallOfAchievement sectionId="certifications" sectionLabel="Certifications" variant="certifications" />
      <CurrentWorks />
      <HallOfAchievement sectionId="achievements" sectionLabel="Achievements" variant="achievements" />
      <Contact />
      <Footer />
    </>
  );
}
