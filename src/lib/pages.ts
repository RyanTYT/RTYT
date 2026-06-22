import { markdownToHtml } from './markdown';
import { gradeClass } from './courses';
import type { CourseRow } from './courses';
import type { ContentEntry } from './content';

interface PersonalInfoStruct {
    name: string;
    short_description: string;
    full_description: string;
    skills_tags: string[];
    status: string;
    resume_url: string;
    tech_stack: {
        layer: string;
        tech: string[];
        usage: string
    }[],
}

// ─── Contact data interface ───────────────────────────────────

export interface ContactData {
  email: string;
  github: string;
  phone: string;
  status: string;
  resume_url: string;
}

// ─── Badge class mapping ──────────────────────────────────────

const TAG_BADGE_MAP: Record<string, string> = {
  rust: 'bd-r',
  tokio: 'bd-r',
  python: 'bd-p',
  postgresql: 'bd-pg',
  ibkr: 'bd-i',
  llms: 'bd-a',
  anthropic: 'bd-a',
  gemini: 'bd-a',
  react: 'bd-j',
  nodejs: 'bd-j',
  'sap-cap': 'bd-j',
  sapui5: 'bd-j',
  trading: 'bd-r',
  neovim: 'bd-a',
  tools: 'bd-j',
  productivity: 'bd-j',
  programming: 'bd-r',
  hackathons: 'bd-a',
  reflections: 'bd-a',
  university: 'bd-j',
  decisions: 'bd-j',
  internship: 'bd-j',
  sap: 'bd-j',
  llm: 'bd-a',
  keyboards: 'bd-j',
  meta: 'bd-a',
  writing: 'bd-a',
  research: 'bd-a',
};

function badgeClass(tag: string): string {
  return TAG_BADGE_MAP[tag.toLowerCase()] || 'bd-a';
}

// ─── Static pages (structural/meta — never change with content) ──

const STATIC_PAGES: Record<string, string> = {
  vimrc: `<div class="md-h1">.vimrc</div>
<div class="md-p" style="color:var(--mu)">Ryan's keybinding configuration</div><hr class="md-divider">
<div class="md-pre"><code><span class="cm">" ═══ NAVIGATION ═══</span>
<span class="fn">nnoremap</span> j        <span class="st">:next-item</span>         <span class="cm">" move down in tree/content</span>
<span class="fn">nnoremap</span> k        <span class="st">:prev-item</span>         <span class="cm">" move up in tree/content</span>
<span class="fn">nnoremap</span> h        <span class="st">:focus-tree</span>        <span class="cm">" return focus to tree pane</span>
<span class="fn">nnoremap</span> l        <span class="st">:open-item</span>         <span class="cm">" open file / enter content pane</span>
<span class="fn">nnoremap</span> &lt;CR&gt;     <span class="st">:open-item</span>         <span class="cm">" open file / expand review</span>
<span class="fn">nnoremap</span> &lt;Up&gt;     <span class="st">:prev-item</span>         <span class="cm">" arrow key alias</span>
<span class="fn">nnoremap</span> &lt;Down&gt;   <span class="st">:next-item</span>         <span class="cm">" arrow key alias</span>

<span class="cm">" ═══ MODE SWITCHING ═══</span>
<span class="fn">nnoremap</span> i        <span class="st">:insert-mode</span>       <span class="cm">" terminal command input</span>
<span class="fn">nnoremap</span> :        <span class="st">:command-mode</span>      <span class="cm">" vim ex commands</span>
<span class="fn">inoremap</span> &lt;Esc&gt;    <span class="st">:normal-mode</span>       <span class="cm">" back to normal</span>
<span class="fn">inoremap</span> &lt;CR&gt;     <span class="st">:execute-cmd</span>       <span class="cm">" run terminal command</span>

<span class="cm">" ═══ HIDDEN FILES ═══</span>
<span class="fn">nnoremap</span> I        <span class="st">:toggle-hidden</span>     <span class="cm">" Shift+I toggle dotfiles</span>

<span class="cm">" ═══ COMMANDS (INSERT mode) ═══</span>
<span class="fn">command!</span> help     <span class="st">list all commands</span>
<span class="fn">command!</span> ls       <span class="st">list directory</span>
<span class="fn">command!</span> ls -a    <span class="st">show hidden files (also: Shift+I)</span>
<span class="fn">command!</span> review   <span class="st">read module review (e.g. review CS2040)</span>
<span class="fn">command!</span> clear    <span class="st">clear terminal output</span>
<span class="fn">command!</span> neofetch <span class="st">system info</span>
<span class="fn">command!</span> cowsay   <span class="st">moo</span>

<span class="cm">" ═══ EX COMMANDS (:) ═══</span>
<span class="fn">cnoremap</span> q        <span class="st">:quit-to-landing</span>   <span class="cm">" :q → back to landing</span>
<span class="fn">cnoremap</span> wq       <span class="st">:write-quit</span>        <span class="cm">" :wq → save & quit</span>
<span class="fn">cnoremap</span> help     <span class="st">:open-help-panel</span>   <span class="cm">" :help → Quick Start guide</span></code></div>`,

  help: `<div class="md-h1">Help — Quick Start</div>
<div class="md-p">Welcome to Ryan's portfolio. Navigate like you would in Neovim.</div><hr class="md-divider">
<div class="md-h2">Navigation (NORMAL mode)</div>
<div class="md-pre"><code><span class="fn">j / ↓</span>         move down (tree items or content lines)
<span class="fn">k / ↑</span>         move up
<span class="fn">Enter / l</span>     open file · enter content pane · expand review
<span class="fn">h / ←</span>         return focus to tree from content pane
<span class="fn">I</span>             toggle hidden files (dotfiles) in tree</code></div>
<div class="md-h2">Mode Switching</div>
<div class="md-pre"><code><span class="fn">i</span>             INSERT mode — type terminal commands
<span class="fn">:</span>             COMMAND mode — vim ex commands (:q, :wq, :help)
<span class="fn">Esc</span>           return to NORMAL mode from any mode</code></div>
<div class="md-h2">Terminal Commands (INSERT mode)</div>
<div class="md-pre"><code><span class="fn">help</span>          show all commands
<span class="fn">ls</span>            list directory
<span class="fn">ls -a</span>         reveal hidden files (.journal/, .vimrc)
<span class="fn">review CODE</span>   read module review (e.g. review CS2040)
<span class="fn">reviews</span>       list all reviewed modules
<span class="fn">open FILE</span>     open a file by name
<span class="fn">cat FILE</span>      print file contents in terminal
<span class="fn">tree</span>          show file tree
<span class="fn">neofetch</span>      system info
<span class="fn">cowsay</span>        moo
<span class="fn">clear</span>         clear terminal output
<span class="fn">feedback</span>      open feedback form!</code></div>
<div class="md-h2">Ex Commands (: mode)</div>
<div class="md-pre"><code><span class="fn">:q</span>            quit to landing page
<span class="fn">:wq</span>           write + quit
<span class="fn">:help</span>         open this help panel
<span class="fn">:w</span>            write (read-only, no-op)</code></div>
<div class="md-h2">Easter Eggs</div>
<div class="md-pre"><code><span class="cm">" Hover ~/ryan on the landing page for journal preview</span>
<span class="cm">" Type ls -a to find .journal/ and .vimrc</span>
<span class="cm">" Press Shift+I to toggle dotfiles in the tree</span>
<span class="cm">" The timeline zooms as you scroll deeper</span></code></div>`,
};

// ─── Content page builder ────────────────────────────────────

/**
 * Convert a content entry's markdown body to styled HTML for the IDE editor pane.
 */
function contentToHtml(entry: ContentEntry): string {
  let html = `<div class="md-h1">${entry.title}</div>`;

  // Badge row from tags
  if (entry.tags.length > 0) {
    html += '<div class="md-badge-row">';
    for (const tag of entry.tags) {
      html += `<span class="md-badge ${badgeClass(tag)}">${tag}</span>`;
    }
    html += '</div>';
  }

  // Duration for experience
  if ('duration' in entry && (entry as { duration?: string }).duration) {
    html += `<div class="md-p"><strong>Duration:</strong> ${(entry as { duration?: string }).duration}</div>`;
    html += '<hr class="md-divider">';
  }

  // Parse body markdown into HTML
  html += markdownToHtml(entry.body);

  return html;
}

// ─── Course page builder ─────────────────────────────────────

function makeCourseContent(title: string, desc: string, courses: CourseRow[], reviews: Record<string, string>): string {
  let html = `<div class="md-h1">${title}</div><div class="md-p">${desc}</div><hr class="md-divider"><div class="md-p" style="color:var(--mu);font-size:10px">j/k rows · Enter expand review · h back</div>`;
  courses.forEach((c, i) => {
    const gc = gradeClass(c.Grade);
    const rv = reviews[c.ModuleCode] || reviews[c.Name] ? '<span class="cr-rv">◆</span>' : '<span class="cr-rv"></span>';
    html += `<div class="cr-row" data-idx="${i}" data-code="${c.ModuleCode}"><span class="cr-code">${c.ModuleCode}</span><span class="cr-title">${c.Title}</span><span class="cr-grade ${gc}">${c.Grade}</span>${rv}</div>`;
  });
  return html;
}

// ─── Public API ──────────────────────────────────────────────

export interface PageDataDeps {
  experience: ContentEntry[];
  projects: ContentEntry[];
  journal: ContentEntry[];
  courses: CourseRow[];
  reviews: Record<string, string>;
  contact: ContactData;
  personal_info: PersonalInfoStruct;
}

/**
 * Build all page content from dynamic data.
 * Returns a Record<contentKey, html> that getPageContent uses for lookup.
 */
export function buildPages(deps: PageDataDeps): Record<string, string> {
  const pages: Record<string, string> = { ...STATIC_PAGES };

  // Contact & resume from JSON data
  const c = deps.contact;
  pages['contact'] = `<div class="md-h1">Contact</div><hr class="md-divider"><div class="md-pre"><code><span class="fn">email</span>    ${c.email}\n<span class="fn">github</span>   ${c.github}\n<span class="fn">phone</span>    ${c.phone}\n<span class="fn">status</span>   <span class="st">${c.status}</span></code></div>`;
  pages['resume'] = `<div class="md-p" style="margin-top:20px"><span style="color:var(--pine)">$ open resume.pdf</span></div><div style="margin-top:10px;padding:16px;border:1px solid var(--hm);border-radius:6px;background:var(--o)"><div style="color:var(--gold)">📄 resume.pdf</div><a class="md-link" href="${c.resume_url}" target="_blank">${c.resume_url.replace('https://', '')}</a></div>`;

  pages['readme'] = `<div class="md-h1">${deps.personal_info.name}</div>
<div class="md-badge-row"><span class="md-badge bd-r">Rust</span><span class="md-badge bd-p">Python</span><span class="md-badge bd-pg">PostgreSQL</span><span class="md-badge bd-i">IBKR</span><span class="md-badge bd-a">LLMs</span></div>
<div class="md-p">${deps.personal_info.full_description}</div>
<hr class="md-divider">
<div class="md-h2">Quick Start</div>
<div class="md-pre"><code><span class="cm">// In NORMAL mode (default):</span>
<span class="fn">j/k</span>           navigate tree (left) or content (right)
<span class="fn">Enter</span>         open file / expand review
<span class="fn">h</span>             back to tree from content
<span class="fn">i</span>             enter INSERT mode (type terminal commands)
<span class="fn">:</span>             enter COMMAND mode (vim commands)

<span class="cm">// In INSERT mode (type commands):</span>
<span class="fn">ls -a</span>         reveal hidden .journal/
<span class="fn">review CS2040</span> read module review
<span class="fn">help</span>          list all commands
<span class="fn">feedback</span>      open feedback form!
<span class="fn">Esc</span>           back to NORMAL

<span class="cm">// In COMMAND mode (:):</span>
<span class="fn">:q</span>            quit to landing page
<span class="fn">:wq</span>           write + quit</code></div>
<div class="md-h2">Tech Stack</div>
<table class="md-table"><tr><th>Layer</th><th>Tech</th><th>Usage</th></tr>
${deps.personal_info.tech_stack.map((stack) => {
    return `
    <tr> 
        <td>${stack.layer}</td>
        <td><span class="md-code">${stack.tech.join(" · ")}</span></td>
        <td>${stack.usage}</td>
    </tr>`

}).join("")}
</table>`;

  // Experience pages
  for (const entry of deps.experience) {
    pages[entry.slug] = contentToHtml(entry);
  }

  // Project pages
  for (const entry of deps.projects) {
    pages[entry.slug] = contentToHtml(entry);
  }

  // Journal pages
  for (const entry of deps.journal) {
    const key = `j_${entry.slug.replace(/-/g, '_')}`;
    pages[key] = contentToHtml(entry);
  }

  // Course pages (always from CSV data)
  const byPrefix = (prefixes: string[]) =>
    deps.courses.filter((c) => {
      const p = c.ModuleCode.match(/^[A-Za-z]+/)?.[0]?.toUpperCase();
      return prefixes.includes(p || '');
    });

  pages['cs_courses'] = makeCourseContent('CS', 'Algorithms, systems, networks, ML.', byPrefix(['CS']), deps.reviews);
  pages['fin_courses'] = makeCourseContent('Finance', 'Corporate finance, investments, derivatives.', byPrefix(['FIN']), deps.reviews);
  pages['bt_courses'] = makeCourseContent('Analytics', 'Analytics, ML, risk, capstone.', byPrefix(['BT']), deps.reviews);
  pages['math_courses'] = makeCourseContent('Math', 'Linear algebra, calculus, probability.', byPrefix(['MA', 'ST']), deps.reviews);
  pages['gen_courses'] = makeCourseContent('Business', 'Business core, platforms, economics.', byPrefix(['ACC', 'BSP', 'IS', 'MKT', 'MNO', 'DAO', 'UTC']), deps.reviews);

  return pages;
}

/**
 * Get page content by ID from a pre-built pages map.
 */
export function getPageContent(id: string, pages: Record<string, string>): string {
  return pages[id] || '<div class="md-p" style="color:var(--mu)">no content</div>';
}
