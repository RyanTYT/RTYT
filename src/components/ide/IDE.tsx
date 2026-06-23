import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import type { Mode } from '../../lib/state';
import type { Action } from '../../lib/keybindings';
import { buildTree, getVisibleTree, type TreeItem } from '../../lib/tree-data';
import { buildPages, getPageContent, type ContactData } from '../../lib/pages';
import { parseCourses, buildReviews, type CourseRow } from '../../lib/courses';
import { executeCommand, executeVimCommand, buildFileMap, type CommandContext } from '../../lib/commands';
import { parseExperience, parseProject, parseJournal, type PersonalInfoStruct } from '../../lib/content';
import { useKeybindings } from '../../hooks/useKeybindings';
import { usePaneFocus } from '../../hooks/usePaneFocus';
import { useTerminal } from '../../hooks/useTerminal';
import { TopBar } from './TopBar';
import { Tree } from './Tree';
import { Editor } from './Editor';
import { Terminal } from './Terminal';
import { StatusLine } from './StatusLine';
import { CommandLine } from './CommandLine';

interface IDEProps {
  coursesRaw: string;
  contactRaw: string;
  experienceRaw: string[];
  projectsRaw: string[];
  journalRaw: string[];
  personalInfo: PersonalInfoStruct;
  onLayerChange?: (layer: string) => void;
}

/**
 * Top-level IDE React island.
 * Orchestrates all IDE state: mode, file navigation, tree, pane focus, terminal.
 */
export const IDE: React.FC<IDEProps> = ({ coursesRaw, contactRaw, experienceRaw, projectsRaw, journalRaw, personalInfo, onLayerChange }) => {
  // Parse all content from raw strings
  const experience = useMemo(() => experienceRaw.map(parseExperience), [experienceRaw]);
  const projects = useMemo(() => projectsRaw.map(parseProject), [projectsRaw]);
  const journal = useMemo(() => journalRaw.map(parseJournal), [journalRaw]);
  const contact = useMemo<ContactData>(() => JSON.parse(contactRaw), [contactRaw]);

  // Parse courses from CSV
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

  // Core state
  const [mode, setMode] = useState<Mode>('normal');
  const [currentFile, setCurrentFile] = useState('readme');
  const [currentFileLabel, setCurrentFileLabel] = useState('README.md');
  const [showHidden, setShowHidden] = useState(false);
  const [treeFocus, setTreeFocus] = useState(0);
  const [treeData, setTreeData] = useState<TreeItem[]>(initialTree);

  // Update tree data when initial tree changes (content hot-reload)
  useEffect(() => {
    setTreeData(initialTree);
  }, [initialTree]);

  // Pane focus hook
  const {
    paneRow,
    paneRows,
    paneFocus,
    setPaneFocus,
    setPaneRows,
    paneUp,
    paneDown,
    paneFirst,
    paneLast,
  } = usePaneFocus();

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

  // Count content rows for pane navigation
  useEffect(() => {
    const tmp = document.createElement('div');
    tmp.innerHTML = pageContent;
    const crRows = tmp.querySelectorAll('.cr-row');
    if (crRows.length > 0) {
      setPaneRows(crRows.length);
    } else {
      setPaneRows(tmp.children.length || 1);
    }
  }, [pageContent, setPaneRows]);

  // Toggle a directory open/closed
  const toggleDir = useCallback((dirId: string) => {
    setTreeData((prev) =>
      prev.map((item) =>
        item.id === dirId ? { ...item, open: !item.open } : item
      )
    );
  }, []);

  // Open a file by tree item
  const openFile = useCallback(
    (item: TreeItem) => {
      if (item.type === 'dir') {
        toggleDir(item.id);
      } else if (item.content) {
        setCurrentFile(item.content);
        setCurrentFileLabel(item.label);
        setPaneFocus(true);
        paneFirst();
      }
    },
    [toggleDir, setPaneFocus, paneFirst]
  );

  // Open file by ID + label (from command execution)
  const openFileById = useCallback(
    (id: string, label: string) => {
      setCurrentFile(id);
      setCurrentFileLabel(label);
      setPaneFocus(true);
      paneFirst();
    },
    [setPaneFocus, paneFirst]
  );

  // Handle tree selection by index
  const handleTreeSelect = useCallback(
    (index: number) => {
      setTreeFocus(index);
      const item = visibleTree[index];
      if (item) openFile(item);
    },
    [visibleTree, openFile]
  );

  // Handle action dispatch from keybindings
  const handleAction = useCallback(
    (action: Action) => {
      switch (action.type) {
        case 'navigate': {
          if (paneFocus) {
            switch (action.direction) {
              case 'up': paneUp(); break;
              case 'down': paneDown(); break;
              case 'first': paneFirst(); break;
              case 'last': paneLast(); break;
            }
          } else {
            switch (action.direction) {
              case 'up':
                setTreeFocus((f) => Math.max(0, f - 1));
                break;
              case 'down':
                setTreeFocus((f) => Math.min(visibleTree.length - 1, f + 1));
                break;
              case 'first':
                setTreeFocus(0);
                break;
              case 'last':
                setTreeFocus(visibleTree.length - 1);
                break;
            }
          }
          break;
        }
        case 'open': {
          if (paneFocus) {
            break;
          }
          const item = visibleTree[treeFocus];
          if (item) openFile(item);
          break;
        }
        case 'back': {
          setPaneFocus(false);
          break;
        }
        case 'mode': {
          setMode(action.mode);
          break;
        }
        case 'toggle_hidden': {
          setShowHidden((h) => !h);
          break;
        }
        case 'toggle_focus': {
          setPaneFocus(!paneFocus);
          break;
        }
        case 'quit': {
          onLayerChange?.('landing');
          break;
        }
        case 'none':
          break;
      }
    },
    [
      paneFocus, paneUp, paneDown, paneFirst, paneLast,
      visibleTree, treeFocus, openFile, setPaneFocus, onLayerChange,
    ]
  );

  // Handle insert mode command execution
  const handleInsertSubmit = useCallback(
    (value: string) => {
      if (!value.trim()) return;
      const result = executeCommand(value, showHidden, commandCtx, personalInfo.google_form_url);

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

  // Handle command mode (:) execution
  const handleCommandSubmit = useCallback(
    (value: string) => {
      const result = executeVimCommand(value);

      if (result.output) {
        addLine(`:${value}`, result.output);
      }

      if (result.action === 'quit') {
        onLayerChange?.('landing');
      }

      if (result.action === 'open_file' && result.target) {
        openFileById(result.target, result.targetLabel || result.target);
      }

      setMode('normal');
    },
    [addLine, openFileById, onLayerChange]
  );

  // Handle escape — return to normal mode
  const handleEscape = useCallback(() => {
    setMode('normal');
  }, []);

  // Attach keybinding listener
  useKeybindings({
    onAction: handleAction,
    onInsertSubmit: handleInsertSubmit,
    onCommandSubmit: handleCommandSubmit,
    onEscape: handleEscape,
    getMode: () => mode,
    getPaneFocus: () => paneFocus,
    getInputValue: () => inputRef.current?.value || '',
    clearInput: () => {
      if (inputRef.current) inputRef.current.value = '';
    },
  });

  // Preview text for normal mode command line
  const preview = paneFocus
    ? `Ln ${paneRow + 1}, Col 1`
    : `${visibleTree[treeFocus]?.label || ''}`;

  return (
    <div className="ide-wrap">
      <TopBar currentFile={currentFileLabel} />
      <div className="ide-body">
        <Tree
          items={visibleTree}
          focusIndex={paneFocus ? -1 : treeFocus}
          onSelect={handleTreeSelect}
          showHidden={showHidden}
        />
        <div className="ide-main">
          <Editor
            content={pageContent}
            paneRow={paneRow}
            paneFocus={paneFocus}
            totalLines={paneRows || 1}
          />
          <Terminal lines={termLines} visible={termLines.length > 0} />
        </div>
      </div>
      <StatusLine
        mode={mode}
        file={currentFileLabel}
        row={paneRow}
        totalRows={paneRows || 1}
      />
      <CommandLine
        mode={mode}
        onExecute={mode === 'command' ? handleCommandSubmit : handleInsertSubmit}
        preview={preview}
        inputRef={inputRef}
      />
    </div>
  );
};
