import React, { useCallback, useRef, useEffect, useMemo } from 'react';
import CoursesHeatmap from './CoursesHeatmap';
import type { JournalEntry } from '../../lib/journal';
import type { ContactData } from '../../lib/pages';
import type { PersonalInfoStruct, ShortExperience, ShortProject } from '@/lib/content';

interface Props {
  coursesRaw: string;
  contactJson: string;
  personalInfoJson: PersonalInfoStruct;
  experienceJson: ShortExperience[];
  projectsJson: ShortProject[];
  journalEntries: JournalEntry[];
  onJournalClick: (slug: string) => void;
}

export default function LandingReact({ coursesRaw, contactJson, personalInfoJson, experienceJson, projectsJson, journalEntries, onJournalClick }: Props) {
  const journalRef = useRef<HTMLElement>(null);
  const contact = useMemo<ContactData>(() => JSON.parse(contactJson), [contactJson]);

  const scrollToJournal = useCallback(() => {
    if (journalRef.current) {
      journalRef.current.style.display = 'block';
      journalRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Hide journal section when it scrolls out of view
  useEffect(() => {
    const el = journalRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && el.style.display === 'block') {
          el.style.display = 'none';
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Global backtick listener for quick terminal access
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '`') {
        e.preventDefault();
        window.location.href = `${import.meta.env.BASE_URL}/terminal`;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {/* Nav */}
      <nav className="l1-nav">
        <div className="l1-logo">
          ~/ryan
          <div className="journal-hint">
            <span className="jh-title">📓 .journal/</span>
            <hr className="jh-sep" />
            <a className="jh-link" onClick={scrollToJournal}>
              reveal hidden writings ↓
            </a>
            <hr className="jh-sep" />
            <span className="jh-bottom">
              or type <code className="jh-code">ls -a</code> in terminal mode
            </span>
          </div>
        </div>
        <div className="l1-links">
          <a onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}>experience</a>
          <a onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>projects</a>
          <a onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}>courses</a>
          <a onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <h1 className="hero-name">{personalInfoJson.name}</h1>
        <p className="hero-sub">{personalInfoJson.short_description}</p>
        <div className="hero-tags">
          {
            personalInfoJson.skills_tags.map((tag) => <span className="hero-tag">{tag}</span>)
          }
        </div>
        <a className="hero-cta" href={`${import.meta.env.BASE_URL}/terminal`} data-astro-reload>
          open terminal _
        </a>
        <p className="hero-hint">
          or press <kbd className="hero-kbd">`</kbd>
        </p>
      </section>

      {/* Experience */}
      <section id="experience" className="l1-sec">
        <div className="sec-hdr">~/experience</div>
        {
            experienceJson.map((experience) => {
                return (
                  <div className="exp-card">
                    <div className="exp-title">{experience.title}</div>
                    <div className="exp-meta">{experience.caption}</div>
                    <div className="exp-desc">{experience.description}</div>
                  </div>
                );
            })
        }
      </section>

      {/* Projects */}
      <section id="projects" className="l1-sec">
        <div className="sec-hdr">~/projects</div>
        <div className="proj-grid">
          {
            projectsJson.map((project) => {
              return (
                <div className="proj-card">
                  <div className="proj-title">{project.title}</div>
                  <div className="proj-desc">{project.description}</div>
                  <div className="proj-tags">
                    {project.tags.map((tag) => <span className="proj-tag">{tag}</span>)}
                  </div>
                </div>
              )
            })
          }
        </div>
      </section>

      {/* Courses — Heatmap React island */}
      <section id="courses" className="courses-sec">
        <div className="courses-header">
          <h2 className="courses-header-title">~/courses</h2>
          <span className="courses-header-sub">
            50+ modules · 8 semesters · 5 disciplines
          </span>
        </div>
        <CoursesHeatmap coursesRaw={coursesRaw} />

        {/* Timeline link */}
        <div className="courses-tl-spacer">
          <a className="tl-open" href={`${import.meta.env.BASE_URL}/timeline`} data-astro-transition="timeline">
            → explore full journey (scroll-driven timeline)
          </a>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="l1-sec">
        <div className="sec-hdr">~/contact</div>
        <div className="contact-grid">
          <div className="contact-item">
            <div className="ci-label">email</div>
            <div className="ci-value" dangerouslySetInnerHTML={{__html: contact.email}} />
          </div>
          <div className="contact-item">
            <div className="ci-label">github</div>
            <div className="ci-value" dangerouslySetInnerHTML={{__html: contact.github}} />
          </div>
          <div className="contact-item">
            <div className="ci-label">phone</div>
            <div className="ci-value" dangerouslySetInnerHTML={{__html: contact.phone}} />
          </div>
          <div className="contact-item">
            <div className="ci-label">resume</div>
            <a className="ci-value text-gold" href={contact.resume_url} target='_blank'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" x2="12" y1="15" y2="3"/>
                </svg>
                {" "}here
            </a>
          </div>
          <div className="contact-item">
            <div className="ci-label">status</div>
            <div className="ci-value text-gold">{contact.status}</div>
          </div>
          <div className="contact-item">
            <div className="ci-label">feedback</div>
            <a className="ci-value" href={personalInfoJson.google_form_url} target="_blank" rel="noopener">➔ Leave a note</a>
          </div>
        </div>
      </section>

      {/* Journal (hidden by default — revealed via hover popup) */}
      <section id="journal" className="l1-sec journal-hidden" ref={journalRef}>
        <div className="sec-hdr">~/journal <span className="journal-hidden-tag">(hidden)</span></div>
        <div className="proj-grid">
          {journalEntries.map(entry => (
            <div
              key={entry.slug}
              className="proj-card"
              style={{ cursor: 'pointer' }}
              onClick={() => onJournalClick(entry.slug)}
            >
              <div className="proj-title">{entry.title}</div>
              <div className="proj-desc">{entry.body.slice(0, 80)}...</div>
              <div className="proj-tags">
                {entry.tags.map(tag => (
                  <span key={tag} className="proj-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
