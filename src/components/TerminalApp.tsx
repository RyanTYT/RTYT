import React, { useState, useCallback, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { IDE } from './ide/IDE';
import { IDEMobile } from './ide/IDE_mobile';
import VimWarning from './boot/VimWarning';
import BootSequence from './boot/BootSequence';
import type { PersonalInfoStruct } from '@/lib/content';

const BOOT_COMPLETE_KEY = 'boot-complete';

interface Props {
  coursesRaw: string;
  contactRaw: string;
  experienceRaw: string[];
  projectsRaw: string[];
  journalRaw: string[];
  personalInfo: PersonalInfoStruct;
}

export default function TerminalApp({ coursesRaw, contactRaw, experienceRaw, projectsRaw, journalRaw, personalInfo }: Props) {
  const isMobile = useIsMobile();

  // Check if boot has already been completed this session
  const bootAlreadyDone = typeof window !== 'undefined'
    ? sessionStorage.getItem(BOOT_COMPLETE_KEY) === '1'
    : false;

  const [phase, setPhase] = useState<'warning' | 'booting' | 'ide'>(
    bootAlreadyDone ? 'ide' : 'warning'
  );

  const handleVimProceed = useCallback(() => {
    setPhase('booting');
  }, []);

  const handleVimBack = useCallback(() => {
    window.location.href = `${import.meta.env.BASE_URL}/`;
  }, []);

  const handleBootComplete = useCallback(() => {
    sessionStorage.setItem(BOOT_COMPLETE_KEY, '1');
    setPhase('ide');
  }, []);

  const handleLayerChange = useCallback((target: string) => {
    if (target === 'landing') {
      window.location.href = `${import.meta.env.BASE_URL}/`;
    } else if (target === 'timeline') {
      window.location.href = `${import.meta.env.BASE_URL}/timeline`;
    }
  }, []);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Prevent accidental browser back/forward from exiting the terminal
  useEffect(() => {
    window.history.pushState({ terminal: true }, '');

    const handlePopState = () => {
      window.history.pushState({ terminal: true }, '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <>
      {/* Boot phases */}
      {phase !== 'ide' && (
        <div id="layer-boot" className="layer active">
          <div className="boot-bar-top">
            <div className="dots">
              <span className="dot dot-r"></span>
              <span className="dot dot-y"></span>
              <span className="dot dot-g"></span>
            </div>
            <span className="boot-bar-title">ryan@portfolio — boot</span>
          </div>
          {phase === 'warning' && (
            <VimWarning onProceed={handleVimProceed} onBack={handleVimBack} />
          )}
          {phase === 'booting' && (
            <BootSequence onComplete={handleBootComplete} />
          )}
        </div>
      )}

      {/* IDE */}
      {phase === 'ide' && (
        <div id="layer-ide" className="layer active">
          {isMobile ? (
            <IDEMobile
              coursesRaw={coursesRaw}
              contactRaw={contactRaw}
              experienceRaw={experienceRaw}
              projectsRaw={projectsRaw}
              journalRaw={journalRaw}
              personalInfo={personalInfo}
              onLayerChange={handleLayerChange}
            />
          ) : (
            <IDE
              coursesRaw={coursesRaw}
              contactRaw={contactRaw}
              experienceRaw={experienceRaw}
              projectsRaw={projectsRaw}
              journalRaw={journalRaw}
              personalInfo={personalInfo}
              onLayerChange={handleLayerChange}
            />
          )}
        </div>
      )}
    </>
  );
}
