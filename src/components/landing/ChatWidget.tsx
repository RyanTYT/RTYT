import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { ContactData } from '../../lib/pages';

interface ChatMessage {
  from: 'bot' | 'user';
  text: string;
}

interface ChatOption {
  id: string;
  label: string;
}

export interface ChatbotContent {
  greeting: string;
  options: ChatOption[];
  responses: {
    about: string;
    contact: string;
    resume: string;
    chatbot_first: string[];
    chatbot_repeat: string[];
    chatbot_repeat_2: string[];
    feedback: string;
  };
}

interface Props {
  contact: ContactData;
  content: ChatbotContent;
  feedback_url: string;
}

/**
 * Interpolate {{key}} placeholders with contact data values.
 */
function interpolate(template: string, contact: ContactData): string {
  return template
    .replace(/\{\{email\}\}/g, contact.email)
    .replace(/\{\{github\}\}/g, contact.github)
    .replace(/\{\{phone\}\}/g, contact.phone)
    .replace(/\{\{status\}\}/g, contact.status)
    .replace(/\{\{resume_url\}\}/g, contact.resume_url)
    .replace(/\{\{resume_url_short\}\}/g, contact.resume_url.replace('https://', ''));
}

export default function ChatWidget({ contact, content, feedback_url }: Props) {
  const greeting = useMemo<ChatMessage>(() => ({
    from: 'bot',
    text: content.greeting,
  }), [content.greeting]);

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([greeting]);
  const [showOptions, setShowOptions] = useState(true);
  const [chatbotStage, setChatbotStage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const togglePanel = useCallback(() => {
    if (panelOpen) {
      setPanelOpen(false);
      closeTimer.current = setTimeout(() => setPanelVisible(false), 250);
    } else {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setPanelVisible(true);
      requestAnimationFrame(() => setPanelOpen(true));
    }
  }, [panelOpen]);

  const addBotMessage = useCallback((text: string, delay = 600) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text }]);
    }, delay);
  }, []);

  const handleOption = useCallback((id: string) => {
    const option = content.options.find(o => o.id === id)!;
    setMessages(prev => [...prev, { from: 'user', text: option.label }]);
    setShowOptions(false);

    switch (id) {
      case 'about':
        addBotMessage(interpolate(content.responses.about, contact));
        setTimeout(() => setShowOptions(true), 800);
        break;

      case 'contact':
        addBotMessage(interpolate(content.responses.contact, contact));
        setTimeout(() => setShowOptions(true), 800);
        break;

      case 'resume':
        addBotMessage(interpolate(content.responses.resume, contact));
        setTimeout(() => setShowOptions(true), 800);
        break;

      case 'feedback':
        addBotMessage(interpolate(content.responses.feedback, contact));
        setTimeout(() => setShowOptions(true), 800);
        window.open(feedback_url, '_blank')
        break;

      case 'chatbot':
        if (chatbotStage === 0) {
          const [first, second, third] = content.responses.chatbot_first;
          addBotMessage(first);
          if (second) addBotMessage(second, 1400);
          if (third) addBotMessage(third, 2800);
          setChatbotStage(1);
          setTimeout(() => setShowOptions(true), 3000);
        } else if (chatbotStage === 1) {
          const [first, second, third] = content.responses.chatbot_repeat;
          addBotMessage(first);
          if (second) addBotMessage(second, 1400);
          if (third) addBotMessage(third, 2800);
          setChatbotStage(2);
          setTimeout(() => setShowOptions(true), 3000);
        } else {
          const [first, second, third] = content.responses.chatbot_repeat_2;
          addBotMessage(first);
          if (second) addBotMessage(second, 1400);
          if (third) addBotMessage(third, 2800);
          setTimeout(() => setShowOptions(true), 3000);
        }
        break;

      default:
        addBotMessage("I don't know how to handle that yet!");
        setTimeout(() => setShowOptions(true), 800);
    }
  }, [contact, content, addBotMessage, chatbotStage]);

  const handleReset = useCallback(() => {
    setMessages([greeting]);
    setShowOptions(true);
    setChatbotStage(0);
  }, [greeting]);

  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        className={`chat-fab${panelOpen ? ' open' : ''}`}
        onClick={togglePanel}
        aria-label={panelOpen ? 'Close chat' : 'Open chat assistant'}
      >
        {panelOpen ? (
          <span className="chat-fab-icon">✕</span>
        ) : (
          <svg className="chat-fab-svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16v12H5.17L4 17.17V4z" />
            <line x1="8" y1="8.5" x2="8" y2="8.5" strokeWidth="2.5" />
            <line x1="12" y1="8.5" x2="12" y2="8.5" strokeWidth="2.5" />
            <line x1="16" y1="8.5" x2="16" y2="8.5" strokeWidth="2.5" />
            <path d="M8 12h8" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {panelVisible && (
        <div className={`chat-panel${panelOpen ? ' open' : ''}`}>
          <div className="chat-panel-header">
            <span className="chat-panel-title">~/assistant</span>
            <button className="chat-panel-reset" onClick={handleReset} title="Reset chat">↺</button>
          </div>
          <div className="chat-panel-messages" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg chat-msg-${msg.from}`}>
                <div
                  className="chat-msg-bubble"
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                />
              </div>
            ))}
          </div>
          {showOptions && (
            <div className="chat-panel-options">
              {content.options.map(opt => (
                <button
                  key={opt.id}
                  className="chat-option-btn"
                  onClick={() => handleOption(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
