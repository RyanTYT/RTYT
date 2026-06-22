import { useEffect, useRef } from 'react';
import { handleNormalKey, type KeyState, type Action } from '../lib/keybindings';
import type { Mode } from '../lib/state';

interface KeybindingCallbacks {
  onAction: (action: Action) => void;
  onInsertSubmit: (value: string) => void;
  onCommandSubmit: (value: string) => void;
  onEscape: () => void;
  getMode: () => Mode;
  getPaneFocus: () => boolean;
  getInputValue: () => string;
  clearInput: () => void;
}

/**
 * Side-effect hook that attaches a global keydown listener.
 * Delegates to handleNormalKey for normal mode.
 * For insert/command mode, handles Esc (back to normal) and Enter (execute).
 */
export function useKeybindings(callbacks: KeybindingCallbacks): void {
  const keyStateRef = useRef<KeyState>({ pending: null });
  const cbRef = useRef(callbacks);
  cbRef.current = callbacks;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const cb = cbRef.current;
      const mode = cb.getMode();

      if (mode === 'normal') {
        const action = handleNormalKey(e, cb.getPaneFocus(), keyStateRef.current);
        if (action.type !== 'none') {
          e.preventDefault();
          cb.onAction(action);
        }
        // Prevent default for keys we handle (colon, etc.)
        if (e.key === ':' || e.key === 'i') {
          e.preventDefault();
        }
        return;
      }

      // Insert or Command mode
      if (e.key === 'Escape') {
        e.preventDefault();
        cb.onEscape();
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const value = cb.getInputValue();
        cb.clearInput();
        if (mode === 'insert') {
          cb.onInsertSubmit(value);
        } else if (mode === 'command') {
          cb.onCommandSubmit(value);
        }
        return;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
