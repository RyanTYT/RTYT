import React, { useRef, useEffect, useState, useLayoutEffect, useMemo } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE: Show raw markdown source on the focused line (like a real editor).
// Set to `false` to always show rendered markdown regardless of focus.
// ─────────────────────────────────────────────────────────────────────────────
const RAW_LINE_ON_FOCUS = true;

interface EditorProps {
  content: string;
  paneRow: number;
  paneFocus: boolean;
  totalLines: number;
}

/**
 * Editor area with gutter (line numbers) + content pane.
 *
 * Two modes:
 * 1. Course pages: navigate .cr-row elements, highlight with .cr-focus
 * 2. General pages: wrap all child elements as .content-line, highlight with .line-focus
 *
 * When RAW_LINE_ON_FOCUS is enabled, the focused line swaps its rendered HTML
 * for the raw markdown source (stored in data-raw), mimicking a real editor
 * that only renders unfocused lines.
 */
export const Editor: React.FC<EditorProps> = ({ content, paneRow, paneFocus, totalLines }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);

  // Track which element is currently showing raw, so we can restore it
  const rawRestoreRef = useRef<{ el: HTMLElement; html: string } | null>(null);

  // Memoize the HTML object so React doesn't re-set innerHTML on every render
  const htmlContent = useMemo(() => ({ __html: content }), [content]);

  // After content renders, wrap children as content-line (for non-course pages)
  useLayoutEffect(() => {
    if (!contentRef.current) return;
    const cnt = contentRef.current;

    const crRows = cnt.querySelectorAll('.cr-row');
    if (crRows.length > 0) {
      setLineCount(crRows.length);
      return;
    }

    // General page: mark all direct children as content-line
    const children = Array.from(cnt.children);
    children.forEach((child) => {
      if (!child.classList.contains('content-line')) {
        child.classList.add('content-line');
      }
      // Mark non-interactive elements (hr) so j/k navigation can skip them
      if (child.tagName === 'HR') {
        child.classList.add('content-line-skip');
      }
    });
    setLineCount(children.length || 1);
  }, [content]);

  // Handle focus highlighting + raw source swap
  useEffect(() => {
    if (!contentRef.current) return;
    const cnt = contentRef.current;

    // ── Restore previously raw-swapped element ──────────────────
    if (rawRestoreRef.current) {
      const { el, html } = rawRestoreRef.current;
      if (cnt.contains(el)) {
        el.innerHTML = html;
        el.classList.remove('raw-focus');
      }
      rawRestoreRef.current = null;
    }

    // Remove ALL previous focus classes
    cnt.querySelectorAll('.cr-focus').forEach((el) => el.classList.remove('cr-focus'));
    cnt.querySelectorAll('.line-focus').forEach((el) => el.classList.remove('line-focus'));

    if (!paneFocus || paneRow < 0) return;

    // Check if course page
    const crRows = cnt.querySelectorAll('.cr-row');
    if (crRows.length > 0) {
      if (crRows[paneRow]) {
        crRows[paneRow].classList.add('cr-focus');
        crRows[paneRow].scrollIntoView({ block: 'nearest' });
      }
    } else {
      // General page: highlight the focused content-line
      const lines = cnt.querySelectorAll('.content-line');
      const focusedEl = lines[paneRow] as HTMLElement | undefined;
      if (focusedEl) {
        focusedEl.classList.add('line-focus');
        focusedEl.scrollIntoView({ block: 'nearest' });

        // ── Raw-on-focus swap ─────────────────────────────────────
        if (RAW_LINE_ON_FOCUS) {
          const rawSource = focusedEl.getAttribute('data-raw');
          if (rawSource) {
            // Save the rendered HTML so we can restore later
            rawRestoreRef.current = { el: focusedEl, html: focusedEl.innerHTML };
            // Replace content with raw markdown source
            focusedEl.innerHTML = `<span class="raw-src">${escapeForDisplay(rawSource)}</span>`;
            focusedEl.classList.add('raw-focus');
          }
        }
      }
    }
  }, [paneRow, paneFocus, content]);

  // Generate gutter line numbers
  const gutterLines = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="ide-editor">
      <div className="ide-gut">
        {gutterLines.map((n) => (
          <span key={n} className={n === paneRow + 1 && paneFocus ? 'cur' : ''}>
            {n}
          </span>
        ))}
      </div>
      <div
        className={`ide-cnt${paneFocus ? ' pane-active' : ''}`}
        ref={contentRef}
        dangerouslySetInnerHTML={htmlContent}
      />
    </div>
  );
};

/**
 * Convert HTML-entity-encoded raw source back to displayable text.
 * The data-raw attribute stores escaped HTML entities — we decode them
 * then re-escape for safe display (preserving newlines as <br>).
 */
function escapeForDisplay(raw: string): string {
  const decoded = raw
    .replace(/&#10;/g, '\n')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
  // Re-escape for safe innerHTML but preserve structure
  return decoded
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}
