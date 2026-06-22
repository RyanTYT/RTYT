import React, { useEffect } from 'react';
import type { Mode } from '../../lib/state';

interface CommandLineProps {
  mode: Mode;
  onExecute: (value: string) => void;
  preview: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

/**
 * Input area for : (command) and terminal (insert) mode.
 * Auto-focuses the input when entering insert/command mode.
 */
export const CommandLine: React.FC<CommandLineProps> = ({ mode, onExecute, preview, inputRef }) => {
  // Auto-focus input when mode changes to insert or command
  useEffect(() => {
    if ((mode === 'insert' || mode === 'command') && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode, inputRef]);

  if (mode === 'normal') {
    return (
      <div className="ide-cl">
        <span className="cmd-preview">{preview}</span>
      </div>
    );
  }

  const prefix = mode === 'command' ? ':' : '❯';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = inputRef.current?.value || '';
      if (inputRef.current) inputRef.current.value = '';
      onExecute(value);
    }
    // Do NOT stopPropagation on Escape — let it bubble to the window
    // listener in useKeybindings which handles mode switching
  };

  return (
    <div className="ide-cl">
      <span className="cmd-pre">{prefix}</span>
      <input
        ref={inputRef}
        className="cmd-in"
        type="text"
        autoComplete="off"
        spellCheck={false}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
