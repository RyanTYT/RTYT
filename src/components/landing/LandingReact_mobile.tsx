import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import CoursesHeatmap_mobile from './CoursesHeatmap_mobile';
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

/**
 * Mobile landing page.
 * Easter egg: long-press (500ms) on ~/ryan logo reveals hidden journal section.
 * A tiny dot hint appears after 3s to subtly indicate interactivity.
 */
export default function LandingReact_mobile({ coursesRaw, contactJson, journalEntries, personalInfoJson, experienceJson, projectsJson, onJournalClick }: Props) {
  const contact = useMemo<ContactData>(() => JSON.parse(contactJson), [contactJson]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [journalVisible, setJournalVisible] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const journalRef = useRef<HTMLElement>(null);

  // for journal section
  const [tapCount, setTapCount] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const TAPS_REQUIRED = 7;

  const toggleMenu = useCallback(() => {
    if (menuOpen) {
      // Close: remove open class, then unmount after animation
      setMenuOpen(false);
      menuTimer.current = setTimeout(() => setMenuVisible(false), 300);
    } else {
      // Open: mount immediately, then add open class
      if (menuTimer.current) clearTimeout(menuTimer.current);
      setMenuVisible(true);
      requestAnimationFrame(() => setMenuOpen(true));
    }
  }, [menuOpen]);

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false);
    menuTimer.current = setTimeout(() => setMenuVisible(false), 300);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleLogоTap = useCallback(() => {
    setTapCount(prev => {
      const next = prev + 1;
      const remaining = TAPS_REQUIRED - next;

      // Clear previous toast timer
      if (toastTimer.current) clearTimeout(toastTimer.current);

      if (next >= TAPS_REQUIRED) {
        setToastMsg('✦ journal unlocked');
        setJournalVisible(true);
        setTimeout(() => journalRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        toastTimer.current = setTimeout(() => setToastMsg(null), 2000);
        // Reset tap counter after unlock
        if (tapTimer.current) clearTimeout(tapTimer.current);
        return 0;
      }

      // Only show toast from tap 2 onwards so first tap isn't noisy
      if (next > 1) {
        setToastMsg(`${remaining} more tap${remaining !== 1 ? 's' : ''} to unlock journal`);
        toastTimer.current = setTimeout(() => setToastMsg(null), 1000);
      }

      // Reset counter if user stops tapping for 1.5s
      if (tapTimer.current) clearTimeout(tapTimer.current);
      tapTimer.current = setTimeout(() => setTapCount(0), 1500);

      return next;
    });
  }, []);

  // Hide journal when it scrolls out of view
  useEffect(() => {
    const el = journalRef.current;
    if (!el || !journalVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setJournalVisible(false);
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [journalVisible]);

  return (
    <>
      {/* Mobile Nav */}
      <nav className="m-nav">
        <div
          className="m-nav-logo"
          onClick={handleLogоTap}
        >
          ~/ryan
          <span className="m-dot-hint" />
        </div>
        <button
          className={`m-nav-hamburger${menuOpen ? ' open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="m-ham-line" />
          <span className="m-ham-line" />
          <span className="m-ham-line" />
        </button>
      </nav>

      {menuVisible && (
        <div className={`m-nav-dropdown${menuOpen ? ' open' : ''}`}>
          <a className="m-nav-link" onClick={() => scrollTo('experience')}>experience</a>
          <a className="m-nav-link" onClick={() => scrollTo('projects')}>projects</a>
          <a className="m-nav-link" onClick={() => scrollTo('courses')}>courses</a>
          <a className="m-nav-link" onClick={() => scrollTo('contact')}>contact</a>
        </div>
      )}

      {/* Hero */}
      <section className="m-hero">
        <h1 className="m-hero-name">{personalInfoJson.name}</h1>
        <p className="m-hero-sub">{personalInfoJson.short_description}</p>
        <div className="m-hero-tags">
          {
            personalInfoJson.skills_tags.map((tag) => <span className="m-hero-tag">{tag}</span>)
          }
        </div>
        <a className="m-hero-cta" href={`${import.meta.env.BASE_URL}/terminal`} data-astro-reload>
          open terminal _
        </a>
      </section>

      {/* Experience */}
      <section id="experience" className="m-sec">
        <div className="m-sec-hdr">~/experience</div>
        <div className="m-exp-list">
          {
            experienceJson.map((experience) => {
              return (
                <div className="m-exp-card">
                  <div className="m-exp-title">{experience.title}</div>
                  <div className="m-exp-meta">{experience.caption}</div>
                  <div className="m-exp-desc">{experience.description}</div>
                </div>
              );
            })
          }
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="m-sec">
        <div className="m-sec-hdr">~/projects</div>
        <div className="m-proj-grid">
          {
            projectsJson.map((project) => {
              return (
                <div className="m-proj-card">
                  <div className="m-proj-title">{project.title}</div>
                  <div className="m-proj-desc">{project.description}</div>
                  <div className="m-proj-tags">
                    {project.tags.map((tag) => <span className="proj-tag">{tag}</span>)}
                  </div>
                </div>
              )
            })
          }
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="m-courses-sec">
        <div className="m-courses-header">
          <h2 className="m-courses-title">~/courses</h2>
          <span className="m-courses-sub">
            50+ modules · 8 semesters
          </span>
        </div>
        <CoursesHeatmap_mobile coursesRaw={coursesRaw} />

        <div className="m-courses-tl-spacer">
          <a className="tl-open" href={`${import.meta.env.BASE_URL}/timeline`} data-astro-reload>
            → explore full journey (scroll-driven timeline)
          </a>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="m-sec">
        <div className="m-sec-hdr">~/contact</div>
        <div className="m-contact-grid">
          <div className="m-contact-item">
            <div className="m-ci-label">email</div>
            <div className="m-ci-value">{contact.email}</div>
          </div>
          <div className="m-contact-item">
            <div className="m-ci-label">github</div>
            <div className="m-ci-value">{contact.github}</div>
          </div>
          <div className="m-contact-item">
            <div className="m-ci-label">phone</div>
            <div className="m-ci-value">{contact.phone}</div>
          </div>
          <div className="m-contact-item">
            <div className="m-ci-label">status</div>
            <div className="m-ci-value text-gold">{contact.status}</div>
          </div>
          <div className="contact-item">
            <div className="ci-label">feedback</div>
            <a className="ci-value" href={personalInfoJson.google_form_url} target="_blank" rel="noopener">➔ Leave a note</a>
          </div>
        </div>
      </section>

      {/* Journal — hidden, revealed by multiple-presses on logo */}
      {journalVisible && (
        <section ref={journalRef} className="m-sec m-journal-section">
          <div className="m-sec-hdr">
            .journal/ <span className="m-journal-hidden-tag">(hidden)</span>
          </div>
          <div className="m-proj-grid">
            {journalEntries.map(entry => (
              <div
                key={entry.slug}
                className="m-proj-card"
                onClick={() => onJournalClick(entry.slug)}
              >
                <div className="m-proj-title">{entry.title}</div>
                <div className="m-proj-desc">{entry.body.slice(0, 60)}...</div>
                <div className="m-proj-tags">
                  {entry.tags.map(tag => (
                    <span key={tag} className="m-proj-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* toast for during revelation */}
      {toastMsg && (
        <div className="m-toast" key={toastMsg}>
          {toastMsg}
        </div>
      )}
    </>
  );
}
