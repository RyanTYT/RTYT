import React, { useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import TimelineScroll from './timeline/TimelineScroll';
import TimelineScrollMobile from './timeline/TimelineScroll_mobile';

interface Props {
  coursesRaw: string;
}

export default function TimelineApp({ coursesRaw }: Props) {
  const isMobile = useIsMobile();

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Force full page reload on browser back/forward to prevent stale CSS
  useEffect(() => {
    const handleBeforeSwap = (e: any) => {
      e.preventDefault();
      window.location.href = e.detail?.to?.href || `${import.meta.env.BASE_URL}/`;
    };
    document.addEventListener('astro:before-swap', handleBeforeSwap);
    return () => document.removeEventListener('astro:before-swap', handleBeforeSwap);
  }, []);

  return (
    <div id="layer-timeline" className="layer active">
      <div className="tl-topbar">
        <a className="tl-back" href={`${import.meta.env.BASE_URL}/`} data-astro-reload>← back</a>
        <div className="tl-title">Academic Journey</div>
        <div className="tl-hint">scroll to navigate</div>
      </div>
      {isMobile ? (
        <TimelineScrollMobile coursesRaw={coursesRaw} />
      ) : (
        <TimelineScroll coursesRaw={coursesRaw} />
      )}
    </div>
  );
}
