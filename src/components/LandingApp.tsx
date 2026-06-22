import React, { useState, useCallback, useMemo } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import LandingReact from './landing/LandingReact';
import LandingReactMobile from './landing/LandingReact_mobile';
import JournalPopup from './landing/JournalPopup';
import ChatWidget from './landing/ChatWidget';
import type { ChatbotContent } from './landing/ChatWidget';
import type { JournalEntry } from '../lib/journal';
import { isPopupEntry } from '../lib/journal';
import type { ContactData } from '../lib/pages';
import type { PersonalInfoStruct, ShortExperience, ShortProject } from '@/lib/content';

const BOOT_COMPLETE_KEY = 'boot-complete';

interface Props {
  coursesRaw: string;
  contactJson: string;
  chatbotContentJson: string;
  journalEntriesJson: string;
  personalInfoJson: PersonalInfoStruct;
  experienceJson: ShortExperience[];
  projectsJson: ShortProject[];
}

export default function LandingApp({ coursesRaw, contactJson, chatbotContentJson, journalEntriesJson, personalInfoJson, experienceJson, projectsJson }: Props) {
  const isMobile = useIsMobile();
  const journalEntries: JournalEntry[] = JSON.parse(journalEntriesJson);
  const contact = useMemo<ContactData>(() => JSON.parse(contactJson), [contactJson]);
  const chatbotContent = useMemo<ChatbotContent>(() => JSON.parse(chatbotContentJson), [chatbotContentJson]);

  const [popupEntry, setPopupEntry] = useState<JournalEntry | null>(null);
  const [sessionCleared, setSessionCleared] = useState(false);
  const [showReplayBtn, setShowReplayBtn] = useState(true);

  // Capture once on mount — won't flip when we clear sessionStorage
  const [bootAlreadyDone] = useState(() =>
    typeof window !== 'undefined'
      ? sessionStorage.getItem(BOOT_COMPLETE_KEY) === '1'
      : false
  );

  const handleJournalClick = useCallback((slug: string) => {
    const entry = journalEntries.find(e => e.slug === slug);
    if (!entry) return;

    if (isPopupEntry(entry)) {
      setPopupEntry(entry);
    } else {
      window.location.href = `${import.meta.env.BASE_URL}/journal/${slug}`;
    }
  }, [journalEntries]);

  const handleClosePopup = useCallback(() => {
    setPopupEntry(null);
  }, []);

  const handleClearSession = useCallback(() => {
    sessionStorage.removeItem(BOOT_COMPLETE_KEY);
    setSessionCleared(true);
    setTimeout(() => {
      setShowReplayBtn(false);
    }, 3000);
  }, []);

  return (
    <>
      <div id="layer-landing">
        {isMobile ? (
          <LandingReactMobile
            coursesRaw={coursesRaw}
            contactJson={contactJson}
            personalInfoJson={personalInfoJson}
            experienceJson={experienceJson}
            projectsJson={projectsJson}
            journalEntries={journalEntries}
            onJournalClick={handleJournalClick}
          />
        ) : (
          <LandingReact
            coursesRaw={coursesRaw}
            contactJson={contactJson}
            personalInfoJson={personalInfoJson}
            experienceJson={experienceJson}
            projectsJson={projectsJson}
            journalEntries={journalEntries}
            onJournalClick={handleJournalClick}
          />
        )}
      </div>

      <JournalPopup entry={popupEntry} onClose={handleClosePopup} />
      <ChatWidget contact={contact} content={chatbotContent} feedback_url={personalInfoJson.google_form_url}/>

      {/* Hidden boot session button — peeks from bottom-left when boot was already seen */}
      {bootAlreadyDone && showReplayBtn && (
        sessionCleared ? (
          <div className="boot-replay-btn boot-replay-cleared">
            ✓ session cleared, terminal :quit
          </div>
        ) : (
          <button
            className="boot-replay-btn"
            onClick={handleClearSession}
            title="Clear boot session"
          >
            ⟳ boot
          </button>
        )
      )}
    </>
  );
}
