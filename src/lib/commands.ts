import type { ContentEntry } from './content';

export interface CommandResult {
  output: string;
  action?: 'open_file' | 'open_review' | 'clear' | 'quit' | 'toggle_hidden';
  target?: string;
  targetLabel?: string;
}

const EASTER_EGGS: Record<string, string> = {
  'sudo rm -rf /':
    '<span style="color:var(--love)">Permission denied.</span> <span style="color:var(--gold)">nice try.</span>',
  vim: "<span style=\"color:var(--gold)\">you're already in vim.</span>",
  emacs: '<span style="color:var(--love)">command not found: emacs</span>',
  exit: '<span style="color:var(--gold)">:q to escape.</span>',
  pwd: '/home/ryan/portfolio',
  neofetch:
    '<span style="color:var(--iris)">  ___  </span> ryan@portfolio\n<span style="color:var(--iris)"> /   \\ </span> OS: RyanOS 2025\n<span style="color:var(--iris)">|o   o|</span> Theme: Rose Pine\n<span style="color:var(--iris)"> \\_v_/ </span> Editor: nvim\n<span style="color:var(--iris)"> /| |\\ </span> Lang: Rust, Python',
  'make money':
    "<span style=\"color:var(--foam)\">...that's what the bot is for.</span>",
  cowsay:
    ' _________\n< hire me! >\n ---------\n   \\  ^__^\n    \\ (oo)\\_____\n      (__)\\    )',
};

const DIR_MAP: Record<string, string> = {
  projects: 'dir-proj',
  experience: 'dir-exp',
  courses: 'dir-courses',
  '.journal': 'dir-journal',
  journal: 'dir-journal',
  contact: 'dir-contact',
};

// ─── Static file entries (not derived from content/) ─────────

const STATIC_FILE_MAP: Record<string, { id: string; label: string }> = {
  'readme.md': { id: 'readme', label: 'README.md' },
  'cs.md': { id: 'cs-courses', label: 'cs.md' },
  'finance.md': { id: 'fin-courses', label: 'finance.md' },
  'analytics.md': { id: 'bt-courses', label: 'analytics.md' },
  'math.md': { id: 'math-courses', label: 'math.md' },
  'business.md': { id: 'gen-courses', label: 'business.md' },
  'contact.md': { id: 'contact-file', label: 'contact.md' },
  'resume.pdf': { id: 'resume', label: 'resume.pdf' },
  '.vimrc': { id: 'vimrc', label: '.vimrc' },
};

// ─── Builder functions ───────────────────────────────────────

/**
 * Build the file map from content entries + static files.
 */
export function buildFileMap(
  experience: ContentEntry[],
  projects: ContentEntry[],
  journal: ContentEntry[],
): Record<string, { id: string; label: string }> {
  const map: Record<string, { id: string; label: string }> = { ...STATIC_FILE_MAP };

  for (const entry of experience) {
    map[entry.filename.toLowerCase()] = { id: entry.slug, label: entry.filename };
  }
  for (const entry of projects) {
    map[entry.filename.toLowerCase()] = { id: entry.slug, label: entry.filename };
  }
  for (const entry of journal) {
    map[entry.filename.toLowerCase()] = { id: `j-${entry.slug}`, label: entry.filename };
  }

  return map;
}

/**
 * Build ls output for a directory from content entries.
 */
function buildLsOutput(
  dirArg: string,
  showAll: boolean,
  showHidden: boolean,
  experience: ContentEntry[],
  projects: ContentEntry[],
  journal: ContentEntry[],
): CommandResult | null {
  if (dirArg === '.' || dirArg === './') {
    let r =
      '<span style="color:var(--iris)">README.md</span>  experience/  projects/  courses/  contact/  <span style="color:var(--iris)">resume.pdf</span>';
    if (showAll) {
      r +=
        '\n<span style="color:var(--mu);font-style:italic">.vimrc  .journal/</span>';
      if (!showHidden) {
        r += '  <span style="color:var(--gold)">👀 revealed in tree</span>';
        return { output: r, action: 'toggle_hidden' };
      }
    }
    return { output: r };
  } else if (dirArg.startsWith('proj')) {
    const files = projects.map((e) => e.filename).join('  ');
    return { output: files || '(empty)' };
  } else if (dirArg.startsWith('course')) {
    return {
      output:
        'cs.md  finance.md  analytics.md  math.md  business.md',
    };
  } else if (dirArg.startsWith('.jour') || dirArg.startsWith('jour')) {
    const files = journal.map((e) => e.filename).join('  ');
    return { output: files || '(empty)' };
  } else if (dirArg.startsWith('exp')) {
    const files = experience.map((e) => e.filename).join('  ');
    return { output: files || '(empty)' };
  } else if (dirArg.startsWith('con')) {
    return { output: 'contact.md' };
  }
  return null;
}

/**
 * Build tree output from content entries.
 */
function buildTreeOutput(
  showHidden: boolean,
  experience: ContentEntry[],
  projects: ContentEntry[],
  journal: ContentEntry[],
): string {
  let t = '<span style="color:var(--foam)">📁 ~/ryan/</span>\n';
  t += '├── README.md\n';

  // Experience
  t += '├── experience/\n';
  for (let i = 0; i < experience.length; i++) {
    const prefix = i === experience.length - 1 ? '│   └──' : '│   ├──';
    t += `${prefix} ${experience[i].filename}\n`;
  }

  // Projects
  t += '├── projects/\n';
  for (let i = 0; i < projects.length; i++) {
    const prefix = i === projects.length - 1 ? '│   └──' : '│   ├──';
    t += `${prefix} ${projects[i].filename}\n`;
  }

  // Courses
  t += '├── courses/\n';
  t += '│   ├── cs.md\n│   ├── finance.md\n│   ├── analytics.md\n│   ├── math.md\n│   └── business.md\n';

  // Contact + resume
  t += '├── contact/\n│   └── contact.md\n';
  t += '└── resume.pdf';

  if (showHidden) {
    t += `\n<span style="color:var(--mu)">└── .journal/  (${journal.length} entries)</span>`;
  }

  return t;
}

// ─── Command execution context ────────────────────────────────

export interface CommandContext {
  experience: ContentEntry[];
  projects: ContentEntry[];
  journal: ContentEntry[];
  reviews: Record<string, string>;
  fileMap: Record<string, { id: string; label: string }>;
}

export function executeCommand(raw: string, showHidden: boolean, ctx: CommandContext, feedback_url: string): CommandResult {
  const trimmed = raw.trim();
  const lo = trimmed.toLowerCase();
  const parts = trimmed.split(/\s+/);
  const base = parts[0].toLowerCase();

  // Easter eggs
  if (EASTER_EGGS[lo]) {
    return { output: EASTER_EGGS[lo] };
  }

  // whoami
  if (base === 'whoami') {
    return {
      output:
        '<span style="color:var(--t)">Ryan Tan Yan Tong</span> · NUS BBA+BZA · quant · builder',
    };
  }

  // review <CODE>
  if (base === 'review') {
    if (!parts[1]) {
      return {
        output: `<span style="color:var(--mu)">usage:</span> review &lt;CODE&gt;\n<span style="color:var(--foam)">${Object.keys(ctx.reviews).join('  ')}</span>`,
      };
    }
    const code = parts[1].toUpperCase();
    const review = ctx.reviews[code];
    if (review) {
      return {
        output: `<span style="color:var(--iris)">${code}</span> <span style="color:var(--gold)"></span>\n${review}`,
        action: 'open_review',
        target: code,
      };
    }
    return {
      output: `<span style="color:var(--love)">no review for '${parts[1]}'</span>`,
    };
  }

  // reviews
  if (base === 'reviews') {
    let t = `<span style="color:var(--iris)">Reviews (${Object.keys(ctx.reviews).length})</span>\n`;
    for (const code of Object.keys(ctx.reviews)) {
      t += `<span style="color:var(--foam)">${code.padEnd(10)}</span>${ctx.reviews[code].substring(0, 40)}\n`;
    }
    return { output: t };
  }

  // ls
  if (base === 'ls') {
    const showAll = lo.includes('-a') || lo.includes('-la') || lo.includes('-al');
    const dirArg =
      parts
        .slice(1)
        .filter((p) => !p.startsWith('-'))[0] || '.';

    const result = buildLsOutput(dirArg, showAll, showHidden, ctx.experience, ctx.projects, ctx.journal);
    if (result) return result;
    return {
      output: `<span style="color:var(--love)">ls: ${dirArg}: No such directory</span>`,
    };
  }

  // cd
  if (base === 'cd') {
    const target = (parts[1] || '~').replace(/\/$/, '');
    if (DIR_MAP[target]) {
      return { output: `<span style="color:var(--foam)">~/ryan/${target}</span>` };
    } else if (target === '~' || target === '..') {
      return { output: '<span style="color:var(--foam)">~/ryan</span>' };
    }
    return {
      output: `<span style="color:var(--love)">cd: ${target}: not found</span>`,
    };
  }

  // cat / open
  if (base === 'cat' || base === 'open') {
    const fileName = parts[1] || '';
    const mapped = ctx.fileMap[fileName.toLowerCase()];
    if (mapped) {
      return {
        output: `<span style="color:var(--foam)">→ ${fileName}</span>`,
        action: 'open_file',
        target: mapped.id,
        targetLabel: mapped.label,
      };
    }
    return {
      output: `<span style="color:var(--love)">${base}: ${fileName || '(no file)'}: not found</span>`,
    };
  }

  // tree
  if (base === 'tree') {
    return { output: buildTreeOutput(showHidden, ctx.experience, ctx.projects, ctx.journal) };
  }

  // help
  if (base === 'help') {
    return {
      output: `<span style="color:var(--iris)">Commands:</span> whoami  ls [-a]  cd <dir>  cat <file>  open <file>
         review <CODE>  reviews  tree  clear  help
<span style="color:var(--foam)">Nav:</span>  j/k ↕  Enter open  h ← tree  i → terminal  : → vim
<span style="color:var(--gold)">Try:</span>  ls -a  ·  review CS2040  ·  neofetch  ·  cowsay`,
    };
  }

  if (base === 'feedback') {
      window.open(feedback_url, '_blank')
      return {
          output: `<span style="color:var(-foam)">➔ opening feedback form...</span>`
      }
  }

  // clear
  if (base === 'clear') {
    return { output: '', action: 'clear' };
  }

  // unknown command
  return {
    output: `<span style="color:var(--love)">command not found: ${trimmed}</span> · <span style="color:var(--foam)">help</span>`,
  };
}

export function executeVimCommand(cmd: string): CommandResult {
  const c = cmd.trim();

  if (c === 'q' || c === 'q!' || c === 'qa') {
    return { output: '', action: 'quit' };
  }
  if (c === 'wq') {
    return { output: '', action: 'quit' };
  }
  if (c === 'w') {
    return {
      output: '<span style="color:var(--foam)">written (read-only)</span>',
    };
  }
  if (c.toLowerCase() === 'ex' || c === 'Explore' || c === 'explore') {
    return { output: '', action: 'open_file', target: '__tree__', targetLabel: 'explorer' };
  }
  if (c === 'help' || c === 'h') {
    return {
      output: '',
      action: 'open_file',
      target: 'help',
      targetLabel: ':help',
    };
  }
  return {
    output: `<span style="color:var(--love)">E492: ${c}</span>`,
  };
}
