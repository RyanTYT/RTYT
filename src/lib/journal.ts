/**
 * Journal entry utilities — popup vs. full-page routing.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ TUNABLE: Adjust this value to control when journal entries  │
 * │ open as a popup vs. navigate to /journal/[slug].            │
 * │ Try 300–800 to see the visual difference.                   │
 * └─────────────────────────────────────────────────────────────┘
 */
export const JOURNAL_POPUP_MAX_CHARS = 600;

export interface JournalEntry {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  filename: string;
  body: string;
}

/**
 * Returns true if the entry should open as a popup (short content).
 * Returns false if it should navigate to /journal/[slug] (long content).
 */
export function isPopupEntry(entry: JournalEntry): boolean {
  return entry.body.length <= JOURNAL_POPUP_MAX_CHARS;
}
