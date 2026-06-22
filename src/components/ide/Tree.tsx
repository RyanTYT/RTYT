import React from 'react';
import type { TreeItem } from '../../lib/tree-data';

interface TreeProps {
  items: TreeItem[];
  focusIndex: number;
  onSelect: (index: number) => void;
  showHidden: boolean;
}

/**
 * File tree sidebar. Renders tree items with indentation, icons, folder open/close state.
 */
export const Tree: React.FC<TreeProps> = ({ items, focusIndex, onSelect }) => {
  return (
    <div className="ide-tree">
      <div className="tree-hdr">explorer</div>
      <div className="tree-body">
        {items.map((item, i) => {
          const isActive = i === focusIndex;
          const classes = ['ti'];
          if (isActive) classes.push('sel', 'foc');
          if (item.indent > 0) classes.push('i1');

          const dirIndicator =
            item.type === 'dir' ? (item.open ? '▾ ' : '▸ ') : '';

          return (
            <div
              key={item.id}
              className={classes.join(' ')}
              style={item.indent > 1 ? { paddingLeft: `${14 + item.indent * 14}px` } : undefined}
              onClick={() => onSelect(i)}
            >
              <span>{item.icon}</span>
              <span>
                {dirIndicator}
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
