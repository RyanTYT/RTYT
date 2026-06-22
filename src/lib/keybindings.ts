import type { Mode } from './state';

export type Action =
  | { type: 'navigate'; direction: 'up' | 'down' | 'first' | 'last' }
  | { type: 'open' }
  | { type: 'back' }
  | { type: 'mode'; mode: Mode }
  | { type: 'toggle_hidden' }
  | { type: 'toggle_focus' }
  | { type: 'quit' }
  | { type: 'none' };

export interface KeyState {
  pending: string | null;
}

/**
 * Process a keydown event in NORMAL mode and return the corresponding action.
 * Mutates keyState.pending for multi-key sequences (gg, Ctrl+w Ctrl+w).
 */
export function handleNormalKey(
  e: KeyboardEvent,
  paneFocus: boolean,
  keyState: KeyState
): Action {
  // Handle Ctrl+w (window toggle) — two consecutive Ctrl+w presses
  if (e.ctrlKey && e.key === 'w') {
    if (keyState.pending === 'ctrl-w') {
      keyState.pending = null;
      return { type: 'toggle_focus' };
    } else {
      keyState.pending = 'ctrl-w';
      return { type: 'none' };
    }
  }

  // Handle g prefix (gg = go to top)
  if (keyState.pending === 'g') {
    keyState.pending = null;
    if (e.key === 'g') {
      return { type: 'navigate', direction: 'first' };
    }
    return { type: 'none' };
  }

  // Clear any pending key that isn't relevant
  if (keyState.pending === 'ctrl-w' && !(e.ctrlKey && e.key === 'w')) {
    keyState.pending = null;
  }

  switch (e.key) {
    case 'j':
    case 'ArrowDown':
      return { type: 'navigate', direction: 'down' };

    case 'k':
    case 'ArrowUp':
      return { type: 'navigate', direction: 'up' };

    case 'G':
      return { type: 'navigate', direction: 'last' };

    case 'g':
      keyState.pending = 'g';
      return { type: 'none' };

    case 'Enter':
    case 'l':
    case 'ArrowRight':
      if (paneFocus) {
        // In pane, Enter opens review; l does nothing special
        if (e.key === 'Enter') return { type: 'open' };
        return { type: 'none' };
      }
      return { type: 'open' };

    case 'h':
    case 'ArrowLeft':
      if (paneFocus) {
        return { type: 'back' };
      }
      return { type: 'none' };

    case 'i':
      return { type: 'mode', mode: 'insert' };

    case 'I':
      return { type: 'toggle_hidden' };

    case ':':
      return { type: 'mode', mode: 'command' };

    default:
      return { type: 'none' };
  }
}
