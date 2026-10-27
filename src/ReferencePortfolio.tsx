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
            <div className="actions"><a className="button red" href="#projects">View Projects</a><a className="button" href="#contact">Contact</a><a className="button" href={contact.resumePath}>Resume</a></div>
          </div>
        </section>

        <div className="marquee" aria-hidden="true"><div>{['Finance', 'Marketing', 'Business', 'Communication', 'Crimson Sanctum', 'Finance', 'Marketing', 'Business', 'Communication'].map((word, index) => <span key={`${word}-${index}`}>{word}</span>)}</div></div>

        <section id="about"><SectionHeading label="About" title={<>A portfolio shaped like a chamber: <em>quiet, deliberate, and immersive.</em></>} /><div className="about-grid"><p>{'Crimson Sanctum'} presents a focused professional story with atmosphere, structure, and honesty at its core.<br /><br />The goal is not noise or embellishment. It is to create a premium digital experience that makes the work easier to trust, easier to remember, and easier to understand.</p><div className="cards">{['Measured craft', 'Strategic clarity', 'Cinematic restraint', 'Long-horizon thinking'].map((title, index) => <article className="card" key={title}><small>0{index + 1}</small><h3>{title}</h3><p>Intentional decisions, clear hierarchy, and a deliberate sense of atmosphere.</p></article>)}</div></div></section>

        <section id="education"><SectionHeading label="Education" title={<>Academic foundation anchored in <em>business and finance.</em></>} />{education.map((entry) => <article className="wide-card" key={entry.id}><small>{entry.status}</small><h3>{entry.program}</h3><p>Specialization: {entry.specialization}</p><p>{entry.institution}</p><div className="details"><span>Current year<strong>{entry.currentYear}</strong></span><span>Current semester<strong>{entry.currentSemester}</strong></span><span>Expected graduation<strong>{entry.expectedGraduation}</strong></span></div></article>)}</section>

        <section id="skills"><SectionHeading label="Skills & Tech Stack" title={<>Finance-rooted discipline supported by <em>a modern implementation stack.</em></>} /><div className="filters" aria-label="Filter skills">{categories.map((category) => <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="skill-grid">{visibleSkills.map((skill) => <article className="skill-card" key={skill.id}><h3>{skill.name}</h3><p>{skill.evidence}</p></article>)}</div></section>

        <section id="certifications"><SectionHeading label="Certifications" title={<>Verified recognitions collected <em>along the journey.</em></>} /><div className="recognitions">{certificates.filter((item) => item.type?.toLowerCase().includes('certificate')).map((item) => <article className="recognition" key={item.id}>{item.imagePath && <img src={item.imagePath} alt={`${item.title} certificate`} loading="lazy" />}<h3>{item.title}</h3><p>{item.description}</p><small>{item.date}</small></article>)}</div></section>

        <section id="projects"><SectionHeading label="Projects · Current Works & Future Ventures" title={<>Work in motion today, and structured space for verified ventures tomorrow.</>} /><div className="project-grid">{works.map((work) => <article className="wide-card" key={work.id}><small>{work.status}</small><h3>{work.title}</h3><p>{work.summary}</p></article>)}</div></section>

        <section id="achievements"><SectionHeading label="Achievements" title={<>Verified recognitions collected <em>along the journey.</em></>} /><div className="recognitions">{certificates.filter((item) => !item.type?.toLowerCase().includes('certificate')).map((item) => <article className="recognition" key={item.id}>{item.imagePath && <img src={item.imagePath} alt={`${item.title} recognition`} loading="lazy" />}<h3>{item.title}</h3><p>{item.description}</p><small>{item.date}</small></article>)}</div></section>

        <section id="contact" className="contact"><SectionHeading label="Contact" title={<>Open to meaningful conversation</>} /><p>{contact.availability}</p><div className="contact-links"><a href={`mailto:${contact.email}`}>Email</a><a href={contact.github} target="_blank" rel="noreferrer">GitHub</a><a href={contact.resumePath}>Resume</a></div></section>
      </main>
      <footer><h2>Mohammad Hammad Sadiq</h2><p>BBA Finance &amp; Marketing · Allenhouse Business School</p><small>© {new Date().getFullYear()} Mohammad Hammad Sadiq.</small></footer>
    </div>
  );
}

function SectionHeading({ label, title }: { label: string; title: React.ReactNode }) {
  return <header className="section-heading"><p className="kicker">{label}</p><h2>{title}</h2></header>;
}
