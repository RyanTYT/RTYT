/**
 * Content parsing utilities for markdown files with YAML frontmatter.
 * Used at build time (in .astro pages) to glob content/ files and
 * pass structured data as props to React islands.
 */

// ─── Interfaces ───────────────────────────────────────────────

export interface ContentEntry {
  slug: string;
  filename: string;
  title: string;
  tags: string[];
  body: string;
  date: string;
  /** Which directory this content lives in: experience | projects | journal */
  category: 'experience' | 'projects' | 'journal';
}

export interface ExperienceEntry extends ContentEntry {
  category: 'experience';
  duration?: string;
}

export interface ProjectEntry extends ContentEntry {
  category: 'projects';
}

export interface JournalContentEntry extends ContentEntry {
  category: 'journal';
}

export interface PersonalInfoStruct {
    name: string;
    short_description: string;
    full_description: string;
    skills_tags: string[];
    status: string;
    resume_url: string;
    google_form_url: string;
    tech_stack: {
        layer: string;
        tech: string[];
        usage: string
    }[],
}

export interface ShortExperience {
  title: string;
  caption: string;
  description: string;
} 

export interface ShortProject {
  title: string;
  description: string;
  tags: string[]
}

// ─── Parsing ──────────────────────────────────────────────────

/**
 * Parse a markdown file with YAML frontmatter.
 * Returns the frontmatter fields and the body (everything after the closing ---).
 */
function parseContentFile(raw: string): { frontmatter: Record<string, unknown>; body: string } {
  const trimmed = raw.trim();

  // Must start with ---
  if (!trimmed.startsWith('---')) {
    return { frontmatter: {}, body: trimmed };
  }

  // Find closing ---
  const closingIdx = trimmed.indexOf('---', 3);
  if (closingIdx === -1) {
    return { frontmatter: {}, body: trimmed };
  }

  const yamlBlock = trimmed.slice(3, closingIdx).trim();
  const body = trimmed.slice(closingIdx + 3).trim();

  // Simple YAML parser for flat key-value pairs + arrays
  const frontmatter: Record<string, unknown> = {};
  for (const line of yamlBlock.split('\n')) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    let value: unknown = rawValue;

    // Handle quoted strings
    if ((rawValue.startsWith('"') && rawValue.endsWith('"')) ||
        (rawValue.startsWith("'") && rawValue.endsWith("'"))) {
      value = rawValue.slice(1, -1);
    }
    // Handle inline arrays [a, b, c]
    else if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      value = rawValue
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''));
    }
    // Handle numbers (for dates stored as plain numbers, keep as string)
    else {
      value = rawValue;
    }

    frontmatter[key] = value;
  }

  return { frontmatter, body };
}

/**
 * Parse a raw markdown file into an ExperienceEntry.
 */
export function parseExperience(raw: string): ExperienceEntry {
  const { frontmatter, body } = parseContentFile(raw);
  return {
    slug: (frontmatter.slug as string) || '',
    filename: (frontmatter.filename as string) || '',
    date: (frontmatter.date as string) || '',
    title: (frontmatter.title as string) || '',
    tags: (frontmatter.tags as string[]) || [],
    duration: (frontmatter.duration as string) || undefined,
    body,
    category: 'experience',
  };
}

/**
 * Parse a raw markdown file into a ProjectEntry.
 */
export function parseProject(raw: string): ProjectEntry {
  const { frontmatter, body } = parseContentFile(raw);
  return {
    slug: (frontmatter.slug as string) || '',
    filename: (frontmatter.filename as string) || '',
    date: (frontmatter.date as string) || '',
    title: (frontmatter.title as string) || '',
    tags: (frontmatter.tags as string[]) || [],
    body,
    category: 'projects',
  };
}

/**
 * Parse a raw markdown file into a JournalContentEntry.
 */
export function parseJournal(raw: string): JournalContentEntry {
  const { frontmatter, body } = parseContentFile(raw);
  return {
    slug: (frontmatter.slug as string) || '',
    filename: (frontmatter.filename as string) || '',
    title: (frontmatter.title as string) || '',
    tags: (frontmatter.tags as string[]) || [],
    date: (frontmatter.date as string) || '',
    body,
    category: 'journal',
  };
}

/**
 * Get the file icon based on filename extension.
 */
export function getFileIcon(filename: string): string {
  if (filename.endsWith('.rs')) return '⚙';
  if (filename.endsWith('.py')) return '🐍';
  if (filename.endsWith('.md')) return '≡';
  if (filename.endsWith('.pdf')) return '📄';
  return '≡';
}

/**
 * Convert a slug to a tree item ID.
 * Experience: slug directly (e.g. "sap")
 * Projects: slug with hyphen (e.g. "trading-bot")
 * Journal: prefixed with "j-" (e.g. "j-trading-rust")
 */
export function slugToTreeId(slug: string, category: 'experience' | 'projects' | 'journal'): string {
  if (category === 'journal') return `j-${slug}`;
  return slug;
}
