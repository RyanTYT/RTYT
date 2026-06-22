import type { ContentEntry } from './content';
import { getFileIcon, slugToTreeId } from './content';

export interface TreeItem {
  id: string;
  label: string;
  icon: string;
  type: 'dir' | 'file';
  indent: number;
  hidden?: boolean;
  open?: boolean;
  parentDir?: string;
  content?: string;
}

/** Static structural items that don't come from content/ */
const STATIC_BEFORE: TreeItem[] = [
  { id: 'readme', label: 'README.md', icon: '📄', type: 'file', indent: 0, content: 'readme' },
];

const DIR_EXPERIENCE: TreeItem = { id: 'dir-exp', label: 'experience/', icon: '📁', type: 'dir', indent: 0, open: true };
const DIR_PROJECTS: TreeItem = { id: 'dir-proj', label: 'projects/', icon: '📁', type: 'dir', indent: 0, open: true };

const STATIC_COURSES: TreeItem[] = [
  { id: 'dir-courses', label: 'courses/', icon: '📁', type: 'dir', indent: 0, open: false },
  { id: 'cs-courses', label: 'cs.md', icon: '≡', type: 'file', indent: 1, parentDir: 'dir-courses', content: 'cs_courses' },
  { id: 'fin-courses', label: 'finance.md', icon: '≡', type: 'file', indent: 1, parentDir: 'dir-courses', content: 'fin_courses' },
  { id: 'bt-courses', label: 'analytics.md', icon: '≡', type: 'file', indent: 1, parentDir: 'dir-courses', content: 'bt_courses' },
  { id: 'math-courses', label: 'math.md', icon: '≡', type: 'file', indent: 1, parentDir: 'dir-courses', content: 'math_courses' },
  { id: 'gen-courses', label: 'business.md', icon: '≡', type: 'file', indent: 1, parentDir: 'dir-courses', content: 'gen_courses' },
];

const STATIC_AFTER: TreeItem[] = [
  { id: 'dir-contact', label: 'contact/', icon: '📁', type: 'dir', indent: 0, open: false },
  { id: 'contact-file', label: 'contact.md', icon: '≡', type: 'file', indent: 1, parentDir: 'dir-contact', content: 'contact' },
  { id: 'resume', label: 'resume.pdf', icon: '📄', type: 'file', indent: 0, content: 'resume' },
  { id: 'vimrc', label: '.vimrc', icon: '⚙', type: 'file', indent: 0, hidden: true, content: 'vimrc' },
];

const DIR_JOURNAL: TreeItem = { id: 'dir-journal', label: '.journal/', icon: '📁', type: 'dir', indent: 0, open: false, hidden: true };

/**
 * Build the nvim-tree structure from content entries.
 * Static structural items (README, courses/*, contact, resume, .vimrc) are kept.
 * Experience, project, and journal entries are generated dynamically.
 */
export function buildTree(
  experience: ContentEntry[],
  projects: ContentEntry[],
  journal: ContentEntry[],
): TreeItem[] {
  const tree: TreeItem[] = [...STATIC_BEFORE];

  // Experience directory
  tree.push(DIR_EXPERIENCE);
  for (const entry of experience.toSorted((a, b) => Date.parse(b.date) - Date.parse(a.date))) {
    tree.push({
      id: slugToTreeId(entry.slug, 'experience'),
      label: entry.filename,
      icon: getFileIcon(entry.filename),
      type: 'file',
      indent: 1,
      parentDir: 'dir-exp',
      content: entry.slug,
    });
  }

  // Projects directory
  tree.push(DIR_PROJECTS);
  for (const entry of projects.toSorted((a, b) => Date.parse(b.date) - Date.parse(a.date))) {
    tree.push({
      id: slugToTreeId(entry.slug, 'projects'),
      label: entry.filename,
      icon: getFileIcon(entry.filename),
      type: 'file',
      indent: 1,
      parentDir: 'dir-proj',
      content: entry.slug,
    });
  }

  // Courses (static — categories are fixed)
  tree.push(...STATIC_COURSES);

  // Contact, resume, vimrc
  tree.push(...STATIC_AFTER);

  // Journal (hidden)
  tree.push(DIR_JOURNAL);
  for (const entry of journal.toSorted((a, b) => Date.parse(b.date) - Date.parse(a.date))) {
    tree.push({
      id: slugToTreeId(entry.slug, 'journal'),
      label: entry.filename,
      icon: getFileIcon(entry.filename),
      type: 'file',
      indent: 1,
      parentDir: 'dir-journal',
      hidden: true,
      content: `j_${entry.slug.replace(/-/g, '_')}`,
    });
  }

  return tree;
}

export function getVisibleTree(items: TreeItem[], showHidden: boolean): TreeItem[] {
  const visible: TreeItem[] = [];

  for (const item of items) {
    // Skip hidden items if showHidden is false
    if (item.hidden && !showHidden) continue;

    // Skip children of closed directories
    if (item.indent > 0 && item.parentDir) {
      const parent = items.find((t) => t.id === item.parentDir);
      if (parent && !parent.open) continue;
      // Also skip if parent is hidden and showHidden is false
      if (parent && parent.hidden && !showHidden) continue;
    }

    visible.push(item);
  }

  return visible;
}
