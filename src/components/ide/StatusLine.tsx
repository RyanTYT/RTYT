import React from 'react';
import type { Mode } from '../../lib/state';

interface StatusLineProps {
  mode: Mode;
  file: string;
  row: number;
  totalRows: number;
}

/**
 * Vim-style status line: mode indicator + git branch + file + cursor position.
 */
export const StatusLine: React.FC<StatusLineProps> = ({ mode, file, row, totalRows }) => {
  const modeLabel = mode === 'normal' ? 'NORMAL' : mode === 'insert' ? 'INSERT' : 'COMMAND';
  const modeClass = mode === 'insert' ? 'sl-m ins' : mode === 'command' ? 'sl-m cmd' : 'sl-m';

  return (
    <div className="ide-sl">
      <div className={modeClass}>{modeLabel}</div>
      <div className="sl-br">⎇ main</div>
      <div className="sl-f">{file}</div>
      <div className="sl-r">
        Ln {row + 1}, Col 1
      </div>
    </div>
  );
};
