import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import type { Mode } from '../../lib/state';
import { buildTree, getVisibleTree, type TreeItem } from '../../lib/tree-data';
import { buildPages, getPageContent, type ContactData } from '../../lib/pages';
import { parseCourses, buildReviews, type CourseRow } from '../../lib/courses';
import { executeCommand, executeVimCommand, buildFileMap, type CommandContext } from '../../lib/commands';
import { parseExperience, parseProject, parseJournal, type PersonalInfoStruct } from '../../lib/content';
import { useTerminal } from '../../hooks/useTerminal';
import { StatusLine } from './StatusLine';
import { CommandLine } from './CommandLine';

interface IDEMobileProps {
  coursesRaw: string;
  contactRaw: string;
  experienceRaw: string[];
  projectsRaw: string[];
  journalRaw: string[];
  personalInfo: PersonalInfoStruct;
  onLayerChange?: (layer: string) => void;
}

type MobileView = 'tree' | 'editor';

/**
 * Mobile IDE — navigation stack layout.
 * Shows either the file tree OR the editor pane, never both simultaneously.
 * Optimised for touch interaction with floating action buttons.
 */
export const IDEMobile: React.FC<IDEMobileProps> = ({ coursesRaw, contactRaw, experienceRaw, projectsRaw, journalRaw, personalInfo, onLayerChange }) => {
  // Parse all content from raw strings
  const experience = useMemo(() => experienceRaw.map(parseExperience), [experienceRaw]);
  const projects = useMemo(() => projectsRaw.map(parseProject), [projectsRaw]);
  const journal = useMemo(() => journalRaw.map(parseJournal), [journalRaw]);
  const contact = useMemo<ContactData>(() => JSON.parse(contactRaw), [contactRaw]);

  // Parse courses CSV
  const courses = useMemo<CourseRow[]>(() => {
    if (!coursesRaw) return [];
    return parseCourses(coursesRaw);
  }, [coursesRaw]);

  // Build reviews from parsed CSV
  const reviews = useMemo(() => buildReviews(courses), [courses]);

  // Build tree dynamically from content
  const initialTree = useMemo(() => buildTree(experience, projects, journal), [experience, projects, journal]);

  // Build pages map
  const pagesMap = useMemo(() => buildPages({ experience, projects, journal, courses, reviews, contact, personal_info: personalInfo }), [experience, projects, journal, courses, reviews, contact]);

  // Build file map for commands
  const fileMap = useMemo(() => buildFileMap(experience, projects, journal), [experience, projects, journal]);

  // Command context
  const commandCtx = useMemo<CommandContext>(() => ({
    experience,
    projects,
    journal,
    reviews,
    fileMap,
  }), [experience, projects, journal, reviews, fileMap]);

  // Navigation state
  const [view, setView] = useState<MobileView>('tree');
  const [mode, setMode] = useState<Mode>('normal');
  const [currentFile, setCurrentFile] = useState('readme');
  const [currentFileLabel, setCurrentFileLabel] = useState('README.md');
  const [showHidden, setShowHidden] = useState(false);
  const [treeFocus, setTreeFocus] = useState(0);
  const [treeData, setTreeData] = useState<TreeItem[]>(initialTree);

  // Update tree data when initial tree changes
  useEffect(() => {
    setTreeData(initialTree);
  }, [initialTree]);

  // Terminal hook
  const { lines: termLines, addLine, clearLines } = useTerminal();

  // Input ref for command line
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Compute visible tree
  const visibleTree = useMemo(
    () => getVisibleTree(treeData, showHidden),
    [treeData, showHidden]
  );

  // Get current page content
  const pageContent = useMemo(
    () => getPageContent(currentFile, pagesMap),
    [currentFile, pagesMap]
  );

  // Count content rows
  const [paneRows, setPaneRows] = useState(1);
  const [paneRow, setPaneRow] = useState(0);

  useEffect(() => {
    const tmp = document.createElement('div');
    tmp.innerHTML = pageContent;
    const crRows = tmp.querySelectorAll('.cr-row');
    if (crRows.length > 0) {
      setPaneRows(crRows.length);
    } else {
      setPaneRows(tmp.children.length || 1);
    }
  }, [pageContent]);

  // Toggle directory open/closed
  const toggleDir = useCallback((dirId: string) => {
    setTreeData((prev) =>
      prev.map((item) =>
        item.id === dirId ? { ...item, open: !item.open } : item
      )
    );
  }, []);

  // Open a file from the tree
  const openFile = useCallback(
    (item: TreeItem) => {
      if (item.type === 'dir') {
        toggleDir(item.id);
      } else if (item.content) {
        setCurrentFile(item.content);
        setCurrentFileLabel(item.label);
        setPaneRow(0);
        setView('editor');
      }
    },
    [toggleDir]
  );

  // Open file by id (from command execution)
  const openFileById = useCallback((id: string, label: string) => {
    setCurrentFile(id);
    setCurrentFileLabel(label);
    setPaneRow(0);
    setView('editor');
  }, []);

  // Handle tree item tap
  const handleTreeTap = useCallback(
    (index: number) => {
      setTreeFocus(index);
      const item = visibleTree[index];
      if (item) openFile(item);
    },
    [visibleTree, openFile]
  );

  // Navigate back to tree (like :Ex)
  const navigateToTree = useCallback(() => {
    setView('tree');
    setMode('normal');
  }, []);

  // Handle command mode (:) execution
  const handleCommandSubmit = useCallback(
    (value: string) => {
      const result = executeVimCommand(value);

      if (result.output) {
        addLine(`:${value}`, result.output);
      }

      // :Ex — return to tree view
      if (result.action === 'open_file' && result.target === '__tree__') {
        navigateToTree();
        setMode('normal');
        return;
      }

      if (result.action === 'quit') {
        onLayerChange?.('landing');
        return;
      }

      if (result.action === 'open_file' && result.target) {
        openFileById(result.target, result.targetLabel || result.target);
      }

      setMode('normal');
    },
    [addLine, openFileById, onLayerChange, navigateToTree]
  );

  // Handle insert mode (terminal) command execution
  const handleInsertSubmit = useCallback(
    (value: string) => {
      if (!value.trim()) return;
      const result = executeCommand(value, showHidden, commandCtx);

      if (result.action === 'clear') {
        clearLines();
        return;
      }

      if (result.output) {
        addLine(value, result.output);
      }

      if (result.action === 'open_file' && result.target) {
        openFileById(result.target, result.targetLabel || result.target);
      }

      if (result.action === 'toggle_hidden') {
        setShowHidden(true);
      }

      if (result.action === 'quit') {
        onLayerChange?.('landing');
      }
    },
    [showHidden, commandCtx, addLine, clearLines, openFileById, onLayerChange]
  );

  // Unified execute handler for CommandLine component
  const handleExecute = useCallback(
    (value: string) => {
      if (mode === 'command') {
        handleCommandSubmit(value);
      } else {
        handleInsertSubmit(value);
      }
    },
    [mode, handleCommandSubmit, handleInsertSubmit]
  );

  // Enter command mode
  const enterCommandMode = useCallback(() => {
    setMode('command');
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  // Enter insert mode (terminal)
  const enterInsertMode = useCallback(() => {
    setMode('insert');
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  // Handle escape — return to normal mode
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMode('normal');
      }
    },
    []
  );

  // Preview text for normal mode
  const preview = view === 'editor'
    ? `Ln ${paneRow + 1}, Col 1`
    : `${visibleTree[treeFocus]?.label || ''}`;

  return (
    <div className="m-ide-wrap" onKeyDown={handleKeyDown}>
      {/* Breadcrumb bar — only in editor view */}
      {view === 'editor' && (
        <div className="m-ide-breadcrumb">
          <button
            className="m-ide-back"
            onClick={navigateToTree}
            aria-label="Back to file tree"
          >
            ←
          </button>
          <span className="m-ide-filename">{currentFileLabel}</span>
        </div>
      )}

      {/* Main content area */}
      <div className="m-ide-body">
        {view === 'tree' ? (
          <div className="m-ide-tree">
            {visibleTree.map((item, i) => (
              <div
                key={item.id}
                className={`m-ide-tree-item${i === treeFocus ? ' focused' : ''}${
                  item.type === 'dir' ? ' dir' : ''
                }`}
                style={{ paddingLeft: `${(item.indent ?? 0) * 16 + 12}px` }}
                onClick={() => handleTreeTap(i)}
                role="button"
                tabIndex={0}
              >
                {item.type === 'dir' ? (
                  <span className="m-ide-tree-icon">
                    {item.open ? '▾' : '▸'}
                  </span>
                ) : (
                  <span className="m-ide-tree-icon">📄</span>
                )}
                <span className="m-ide-tree-label">{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="m-ide-editor">
            <div
              className="m-ide-content"
              dangerouslySetInnerHTML={{ __html: pageContent }}
            />
            {/* Terminal output below content */}
            {termLines.length > 0 && (
              <div className="m-ide-terminal">
                {termLines.map((line, i) => (
                  <div key={i} className="m-ide-term-line">
                    <span className="m-ide-term-cmd">❯ {line.cmd}</span>
                    <pre className="m-ide-term-out">{line.output}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating action buttons */}
      <div className="m-ide-fab-row">
        <button
          className="m-ide-fab"
          onClick={enterCommandMode}
          aria-label="Enter command mode"
        >
          :
        </button>
        <button
          className="m-ide-fab"
          onClick={enterInsertMode}
          aria-label="Enter terminal mode"
        >
          ❯
        </button>
      </div>

      {/* Status + Command lines */}
      <StatusLine
        mode={mode}
        file={currentFileLabel}
        row={paneRow}
        totalRows={paneRows}
      />
      <CommandLine
        mode={mode}
        onExecute={handleExecute}
        preview={preview}
        inputRef={inputRef}
      />
    </div>
  );
};
