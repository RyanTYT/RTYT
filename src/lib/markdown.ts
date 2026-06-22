/**
 * Markdown-to-HTML converter for the IDE editor pane.
 * Handles: headings (h1–h4), paragraphs, blockquotes, ordered/unordered lists,
 * code blocks (with language badge), horizontal rules, tables,
 * inline formatting (bold, italic, code, links, images, strikethrough).
 *
 * Each top-level block element includes a `data-raw` attribute containing
 * the original markdown source, enabling "raw on focus" editor behaviour.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Escape for embedding in HTML attribute (data-raw) */
function escapeAttr(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '&#10;');
}

function inlineFormat(text: string): string {
  // Images: ![alt](src) — must come before links
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img class="md-img" src="$2" alt="$1" />');
  // Links: [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="md-link" href="$2" target="_blank" rel="noopener">$1</a>');
  // Bold: **text**
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Strikethrough: ~~text~~
  text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');
  // Italic: *text* or _text_
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/(?<![a-zA-Z0-9])_(.+?)_(?![a-zA-Z0-9])/g, '<em>$1</em>');
  // Inline code: `text`
  text = text.replace(/`(.+?)`/g, '<span class="md-code">$1</span>');
  return text;
}

export function markdownToHtml(md: string): string {
  let html = '';
  const lines = md.split('\n');
  let i = 0;
  let inUl = false;
  let inOl = false;
  let inBlockquote = false;
  let ulRawLines: string[] = [];
  let olRawLines: string[] = [];
  let bqRawLines: string[] = [];

  // Markers to be replaced after the block is complete
  const UL_MARKER = '___UL_RAW___';
  const OL_MARKER = '___OL_RAW___';
  const BQ_MARKER = '___BQ_RAW___';

  function closeList() {
    if (inUl) {
      html += `</ul>`;
      const raw = escapeAttr(ulRawLines.join('\n'));
      html = html.replace(UL_MARKER, raw);
      inUl = false;
      ulRawLines = [];
    }
    if (inOl) {
      html += `</ol>`;
      const raw = escapeAttr(olRawLines.join('\n'));
      html = html.replace(OL_MARKER, raw);
      inOl = false;
      olRawLines = [];
    }
  }

  function closeBlockquote() {
    if (inBlockquote) {
      html += '</div>';
      const raw = escapeAttr(bqRawLines.join('\n'));
      html = html.replace(BQ_MARKER, raw);
      inBlockquote = false;
      bqRawLines = [];
    }
  }

  while (i < lines.length) {
    const line = lines[i];

    // ── Fenced code block ───────────────────────────────────────
    if (line.startsWith('```')) {
      closeList();
      closeBlockquote();
      const lang = line.slice(3).trim();
      const rawLines: string[] = [line];
      let code = '';
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        rawLines.push(lines[i]);
        code += lines[i] + '\n';
        i++;
      }
      if (i < lines.length) rawLines.push(lines[i]);
      i++; // skip closing ```
      const langBadge = lang
        ? `<span class="md-pre-lang">${escapeHtml(lang)}</span>`
        : '';
      const raw = escapeAttr(rawLines.join('\n'));
      html += `<div class="md-pre" data-lang="${escapeHtml(lang)}" data-raw="${raw}">${langBadge}<code>${escapeHtml(code.trimEnd())}</code></div>`;
      continue;
    }

    // ── Horizontal rule ─────────────────────────────────────────
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim()) && !inUl) {
      closeList();
      closeBlockquote();
      html += `<hr class="md-divider" data-raw="${escapeAttr(line)}">`;
      i++;
      continue;
    }

    // ── Table (pipe table) ──────────────────────────────────────
    if (line.includes('|') && line.trim().startsWith('|')) {
      closeList();
      closeBlockquote();
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 2) {
        const raw = escapeAttr(tableLines.join('\n'));
        html += `<table class="md-table" data-raw="${raw}">`;
        // Header row
        const headerCells = tableLines[0].split('|').filter(c => c.trim() !== '');
        html += '<tr>';
        for (const cell of headerCells) {
          html += `<th>${inlineFormat(cell.trim())}</th>`;
        }
        html += '</tr>';
        // Skip separator row (index 1), parse body rows
        for (let r = 2; r < tableLines.length; r++) {
          const cells = tableLines[r].split('|').filter(c => c.trim() !== '');
          html += '<tr>';
          for (const cell of cells) {
            html += `<td>${inlineFormat(cell.trim())}</td>`;
          }
          html += '</tr>';
        }
        html += '</table>';
      }
      continue;
    }

    // ── Headings ────────────────────────────────────────────────
    if (line.startsWith('#### ')) {
      closeList(); closeBlockquote();
      html += `<div class="md-h4" data-raw="${escapeAttr(line)}">${inlineFormat(line.slice(5))}</div>`;
      i++; continue;
    }
    if (line.startsWith('### ')) {
      closeList(); closeBlockquote();
      html += `<div class="md-h3" data-raw="${escapeAttr(line)}">${inlineFormat(line.slice(4))}</div>`;
      i++; continue;
    }
    if (line.startsWith('## ')) {
      closeList(); closeBlockquote();
      html += `<div class="md-h2" data-raw="${escapeAttr(line)}">${inlineFormat(line.slice(3))}</div>`;
      i++; continue;
    }
    if (line.startsWith('# ')) {
      closeList(); closeBlockquote();
      html += `<div class="md-h1" data-raw="${escapeAttr(line)}">${inlineFormat(line.slice(2))}</div>`;
      i++; continue;
    }

    // ── Blockquote (accumulate consecutive > lines) ─────────────
    if (line.startsWith('> ')) {
      closeList();
      if (!inBlockquote) {
        html += `<div class="md-blockquote" data-raw="${BQ_MARKER}">`;
        inBlockquote = true;
      }
      bqRawLines.push(line);
      const content = line.slice(2);
      html += `<p>${inlineFormat(content)}</p>`;
      i++; continue;
    } else if (inBlockquote) {
      closeBlockquote();
    }

    // ── Unordered list ──────────────────────────────────────────
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (inOl) { closeList(); }
      if (!inUl) { html += `<ul class="md-ul" data-raw="${UL_MARKER}">`; inUl = true; }
      ulRawLines.push(line);
      html += `<li>${inlineFormat(line.slice(2))}</li>`;
      i++; continue;
    }

    // ── Ordered list ────────────────────────────────────────────
    const olMatch = line.match(/^(\d+)\.\s(.*)$/);
    if (olMatch) {
      if (inUl) { closeList(); }
      if (!inOl) { html += `<ol class="md-ol" data-raw="${OL_MARKER}">`; inOl = true; }
      olRawLines.push(line);
      html += `<li>${inlineFormat(olMatch[2])}</li>`;
      i++; continue;
    }

    // ── Empty line ──────────────────────────────────────────────
    if (line.trim() === '') {
      closeList();
      closeBlockquote();
      i++; continue;
    }

    // ── Regular paragraph ───────────────────────────────────────
    closeList();
    closeBlockquote();
    html += `<div class="md-p" data-raw="${escapeAttr(line)}">${inlineFormat(line)}</div>`;
    i++;
  }

  closeList();
  closeBlockquote();
  return html;
}
