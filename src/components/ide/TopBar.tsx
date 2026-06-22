import React from 'react';

interface TopBarProps {
  currentFile: string;
}

/**
 * macOS-style window dots + file tab display.
 */
export const TopBar: React.FC<TopBarProps> = ({ currentFile }) => {
  return (
    <div className="ide-top">
      <div className="dots">
        <span className="dot dot-r" />
        <span className="dot dot-y" />
        <span className="dot dot-g" />
      </div>
      <div className="ide-tab">{currentFile}</div>
    </div>
  );
};
