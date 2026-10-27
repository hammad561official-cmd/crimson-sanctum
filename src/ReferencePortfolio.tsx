import { useEffect, useMemo, useState } from 'react';
import certificates from '@/data/certificates.json';
import contact from '@/data/contact.json';
import education from '@/data/education.json';
import works from '@/data/currentWorks.json';
import skills from '@/data/skills.json';

const portrait = '/profile.jpg/https:/Hammad.jpeg';
const categories = ['All', ...Array.from(new Set(skills.map((skill) => skill.category)))];

export function ReferencePortfolio() {
  const [introOpen, setIntroOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    document.body.classList.toggle('locked', introOpen);
    const timer = window.setTimeout(() => setIntroOpen(false), 1400);
    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove('locked');
    };
  }, [introOpen]);

  const visibleSkills = useMemo(
    () => (activeCategory === 'All' ? skills : skills.filter((skill) => skill.category === activeCategory)),
    [activeCategory]
  );

  return (
    <div className="reference-site">
      {introOpen && (
        <div className="intro" role="dialog" aria-modal="true" aria-label="Crimson Sanctum introduction">
          <button type="button" onClick={() => setIntroOpen(false)}>Skip intro</button>
          <div>
            <p>Loading Crimson Sanctum</p>
            <h1>Crimson <em>Sanctum</em></h1>
            <i>An Interactive Portfolio Experience</i>
            <span className="intro-bar" aria-hidden="true"><b /></span>
          </div>
        </div>
      )}

      <header className="site-nav">
        <a className="brand" href="#hero">C <b>·</b> Crimson Sanctum</a>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Primary navigation">
          {['about', 'education', 'skills', 'certifications', 'projects', 'achievements', 'contact'].map((id) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{id.replace('-', ' ')}</a>
          ))}
        </nav>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          <span /><span /><span />
        </button>
      </header>

      <main>
        <section id="hero" className="hero">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-seal" aria-hidden="true"><span>CS</span></div>
          <div className="hero-portrait"><img src={portrait} alt="Portrait of Mohammad Hammad Sadiq" /></div>
          <div className="hero-content">
            <p className="kicker">Crimson Sanctum · Student Portfolio</p>
            <p className="rotor">BBA Finance &amp; Marketing</p>
            <h1 className="hero-name" aria-label="Mohammad Hammad Sadiq">
              {'Hammad'.split('').map((letter, index) => <span key={`${letter}-${index}`} style={{ '--i': index } as React.CSSProperties}>{letter}</span>)}
            </h1>
            <p className="owner-name">Mohammad Hammad Sadiq</p>
            <span className="badge"><b />Open to meaningful conversation</span>
            <p className="hero-copy">Developing practical <strong>finance, business, and communication skills</strong> through study and project-based work.</p>
            <div className="actions"><a className="button red" href="#projects">View Projects</a><a className="button" href="#contact">Contact</a><a className="button icon-button resume-link" href={contact.resumePath} aria-label="Open resume"><ContactIcon type="resume" /></a></div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true"><div>{['Finance', 'Marketing', 'Business', 'Communication', 'Crimson Sanctum', 'Finance', 'Marketing', 'Business', 'Communication'].map((word, index) => <span key={`${word}-${index}`}>{word}</span>)}</div></div>

        <section id="about"><SectionHeading label="About" title={<>A portfolio shaped like a chamber: <em>quiet, deliberate, and immersive.</em></>} /><div className="about-grid"><p>{'Crimson Sanctum'} presents a focused professional story with atmosphere, structure, and honesty at its core.<br /><br />The goal is not noise or embellishment. It is to create a premium digital experience that makes the work easier to trust, easier to remember, and easier to understand.</p><div className="cards">{['Measured craft', 'Strategic clarity', 'Cinematic restraint', 'Long-horizon thinking'].map((title, index) => <article className="card" key={title}><small>0{index + 1}</small><h3>{title}</h3><p>Intentional decisions, clear hierarchy, and a deliberate sense of atmosphere.</p></article>)}</div></div></section>

        <section id="education"><SectionHeading label="Education" title={<>Academic foundation anchored in <em>business and finance.</em></>} />{education.map((entry) => <article className="wide-card" key={entry.id}><small>{entry.status}</small><h3>{entry.program}</h3><p>Specialization: {entry.specialization}</p><p>{entry.institution}</p><div className="details"><span>Current year<strong>{entry.currentYear}</strong></span><span>Current semester<strong>{entry.currentSemester}</strong></span><span>Expected graduation<strong>{entry.expectedGraduation}</strong></span></div></article>)}</section>

        <section id="skills"><SectionHeading label="Skills & Tech Stack" title={<>Finance-rooted discipline supported by <em>a modern implementation stack.</em></>} /><div className="filters" aria-label="Filter skills">{categories.map((category) => <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="skill-grid">{visibleSkills.map((skill) => <article className="skill-card" key={skill.id}><h3>{skill.name}</h3><p>{skill.evidence}</p></article>)}</div></section>

        <section id="certifications"><SectionHeading label="Certifications" title={<>Verified recognitions collected <em>along the journey.</em></>} /><div className="recognitions">{certificates.filter((item) => item.type?.toLowerCase().includes('certificate')).map((item) => <article className="recognition" key={item.id}>{item.imagePath && <img src={item.imagePath} alt={`${item.title} certificate`} loading="lazy" />}<h3>{item.title}</h3><p>{item.description}</p><small>{item.date}</small></article>)}</div></section>

        <section id="projects"><SectionHeading label="Projects · Current Works & Future Ventures" title={<>Work in motion today, and structured space for verified ventures tomorrow.</>} /><div className="project-grid">{works.map((work) => <article className="wide-card" key={work.id}><small>{work.status}</small><h3>{work.title}</h3><p>{work.summary}</p></article>)}</div></section>

        <section id="achievements"><SectionHeading label="Achievements" title={<>Verified recognitions collected <em>along the journey.</em></>} /><div className="recognitions">{certificates.filter((item) => !item.type?.toLowerCase().includes('certificate')).map((item) => <article className="recognition" key={item.id}>{item.imagePath && <img src={item.imagePath} alt={`${item.title} recognition`} loading="lazy" />}<h3>{item.title}</h3><p>{item.description}</p><small>{item.date}</small></article>)}</div></section>

        <section id="contact" className="contact"><SectionHeading label="Contact" title={<>Open to meaningful conversation</>} /><p>{contact.availability}</p><div className="contact-links" aria-label="Contact links">
          <a className="contact-link gmail-link" href={`mailto:${contact.email}`} aria-label="Email Mohammad Hammad Sadiq"><ContactIcon type="gmail" /></a>
          <a className="contact-link github-link" href={contact.github} target="_blank" rel="noreferrer" aria-label="Visit GitHub profile"><ContactIcon type="github" /></a>
          <a className="contact-link resume-link" href={contact.resumePath} aria-label="Open resume"><ContactIcon type="resume" /></a>
          <a className="contact-link whatsapp-link" href="https://wa.me/918707282499" target="_blank" rel="noreferrer" aria-label="Contact on WhatsApp"><ContactIcon type="whatsapp" /></a>
        </div></section>
      </main>
      <footer><h2>Mohammad Hammad Sadiq</h2><p>BBA Finance &amp; Marketing · Allenhouse Business School</p><small>© {new Date().getFullYear()} Mohammad Hammad Sadiq.</small></footer>
    </div>
  );
}

function SectionHeading({ label, title }: { label: string; title: React.ReactNode }) {
  return <header className="section-heading"><p className="kicker">{label}</p><h2>{title}</h2></header>;
}

function ContactIcon({ type }: { type: 'github' | 'resume' | 'gmail' | 'whatsapp' }) {
  const paths = {
    github: <><path d="M12 2.5a9.5 9.5 0 0 0-3 18.51c.48.09.65-.21.65-.46v-1.68c-2.65.58-3.21-1.13-3.21-1.13-.44-1.12-1.08-1.42-1.08-1.42-.88-.6.07-.59.07-.59.97.07 1.48 1 1.48 1 .86 1.47 2.26 1.05 2.81.8.09-.63.34-1.05.62-1.29-2.12-.24-4.35-1.06-4.35-4.72 0-1.04.37-1.89.99-2.56-.1-.24-.43-1.21.09-2.52 0 0 .81-.26 2.62.98A9.1 9.1 0 0 1 12 9.1c.82 0 1.65.11 2.42.33 1.81-1.24 2.62-.98 2.62-.98.52 1.31.19 2.28.09 2.52.62.67.99 1.52.99 2.56 0 3.67-2.24 4.48-4.37 4.72.35.3.66.88.66 1.77v2.62c0 .25.17.55.66.46A9.5 9.5 0 0 0 12 2.5Z" /></>,
    resume: <><path d="M6.5 2.75h6.2L17.5 7.6v13.65h-11Z" /><path d="M12.5 2.75V8h5" /><path d="M8.8 12h6.4M8.8 15h6.4" /></>,
    gmail: <><path d="M3.5 5.5h17v13h-17Z" /><path d="m4 6 8 6 8-6" /></>,
    whatsapp: <><path d="M12 3.1a8.9 8.9 0 0 0-7.7 13.35L3.1 20.9l4.62-1.17A8.9 8.9 0 1 0 12 3.1Z" /><path d="M8.5 8.3c.2-.35.42-.36.7-.36h.48c.14 0 .3.05.4.3l.62 1.5c.1.23.07.4-.08.58l-.48.58c-.12.14-.25.3-.1.56.15.27.66 1.08 1.42 1.74.98.84 1.8 1.1 2.06 1.2.26.1.42.08.58-.1l.73-.86c.17-.2.34-.15.57-.06l1.42.67c.23.1.38.16.43.25.05.1.05.56-.13 1.08-.18.52-1.05.96-1.45 1.02-.37.06-.84.09-1.36-.08-.32-.1-.73-.24-1.25-.47-2.2-.96-3.64-3.2-3.75-3.35-.11-.15-.9-1.2-.9-2.3 0-1.1.56-1.64.77-1.86Z" /></>,
  };

  return <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}
