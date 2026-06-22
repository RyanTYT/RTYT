import React from 'react';
import type { TermLine } from '../../hooks/useTerminal';

interface TerminalProps {
  lines: TermLine[];
  visible: boolean;
}

/**
 * Bottom panel showing terminal command output.
 */
export const Terminal: React.FC<TerminalProps> = ({ lines, visible }) => {
  if (!visible || lines.length === 0) return null;

  return (
    <div className="ide-term open">
      {lines.map((line, i) => (
        <div key={i} className="term-line">
          {line.cmd && (
            <div className="term-cmd">
              <span style={{ color: 'var(--foam)' }}>❯</span> {line.cmd}
            </div>
          )}
          {line.output && (
            <div
              className="term-out"
              dangerouslySetInnerHTML={{ __html: line.output }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
