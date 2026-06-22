import React, { useEffect, useRef, useState } from 'react';
import type { JournalEntry } from '../../lib/journal';

interface Props {
  entry: JournalEntry | null;
  onClose: () => void;
}

export default function JournalPopup({ entry, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (entry) {
      // Open: mount then animate in
      setAnimating(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      // Close: animate out then unmount
      setVisible(false);
      const timer = setTimeout(() => setAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [entry]);

  // Close on Escape
  useEffect(() => {
    if (!entry) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [entry, onClose]);

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!animating && !entry) return null;

  const displayEntry = entry || ({} as JournalEntry);

  return (
    <div
      ref={overlayRef}
      className={`jp-overlay ${visible ? 'jp-visible' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className={`jp-card ${visible ? 'jp-card-open' : ''}`}>
        <button className="jp-close" onClick={onClose} aria-label="Close">×</button>
        <div className="jp-filename">~/.journal/{displayEntry.filename}</div>
        <h2 className="jp-title">{displayEntry.title}</h2>
        <div className="jp-meta">
          <time className="jp-date">{displayEntry.date}</time>
          <div className="jp-tags">
            {displayEntry.tags?.map(tag => (
              <span key={tag} className="jp-tag">{tag}</span>
            ))}
          </div>
        </div>
        <div className="jp-body">
          {displayEntry.body?.split('\n').map((line, i) => {
            if (line.startsWith('> ')) {
              return <blockquote key={i} className="jp-quote">{line.slice(2)}</blockquote>;
            }
            if (line.startsWith('- ')) {
              return <li key={i} className="jp-li">{line.slice(2)}</li>;
            }
            if (line.trim() === '') return <br key={i} />;
            return <p key={i} className="jp-p">{line}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
