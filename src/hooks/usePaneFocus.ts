import { useState, useCallback } from 'react';

interface PaneFocusState {
  paneRow: number;
  paneRows: number;
  paneFocus: boolean;
  setPaneFocus: (v: boolean) => void;
  setPaneRows: (n: number) => void;
  paneUp: () => void;
  paneDown: () => void;
  paneFirst: () => void;
  paneLast: () => void;
}

/**
 * Hook managing pane navigation state for the content editor area.
 * Tracks which row is focused, total rows, and whether the pane has focus.
 */
export function usePaneFocus(): PaneFocusState {
  const [paneRow, setPaneRow] = useState(0);
  const [paneRows, setPaneRows] = useState(0);
  const [paneFocus, setPaneFocus] = useState(false);

  const paneUp = useCallback(() => {
    setPaneRow((r) => Math.max(0, r - 1));
  }, []);

  const paneDown = useCallback(() => {
    setPaneRow((r) => Math.min(paneRows - 1, r + 1));
  }, [paneRows]);

  const paneFirst = useCallback(() => {
    setPaneRow(0);
  }, []);

  const paneLast = useCallback(() => {
    setPaneRow(Math.max(0, paneRows - 1));
  }, [paneRows]);

  return {
    paneRow,
    paneRows,
    paneFocus,
    setPaneFocus,
    setPaneRows,
    paneUp,
    paneDown,
    paneFirst,
    paneLast,
  };
}
