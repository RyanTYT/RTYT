import { useState, useCallback, useRef } from 'react';

export interface TermLine {
  cmd: string;
  output: string;
}

interface TerminalState {
  lines: TermLine[];
  addLine: (cmd: string, output: string) => void;
  clearLines: () => void;
}

/**
 * Hook managing terminal output lines with auto-clear after 8 seconds.
 */
export function useTerminal(): TerminalState {
  const [lines, setLines] = useState<TermLine[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleClear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setLines([]);
      timerRef.current = null;
    }, 8000);
  }, []);

  const addLine = useCallback(
    (cmd: string, output: string) => {
      setLines((prev) => [...prev, { cmd, output }]);
      scheduleClear();
    },
    [scheduleClear]
  );

  const clearLines = useCallback(() => {
    setLines([]);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { lines, addLine, clearLines };
}
