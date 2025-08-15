'use client';

import React, { useState, useEffect } from 'react';
import { CheatSheetItem } from '@/data/cheatsheet';
import CheatSheetCard from './CheatSheetCard';

interface MasonryGridProps {
  items: CheatSheetItem[];
  onCardExpand: (item: CheatSheetItem, index: number) => void;
  onLinkClick?: (cardId: string) => void;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ items, onCardExpand, onLinkClick }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setColumns(1);
      } else if (width < 1024) {
        setColumns(2);
      } else if (width < 1536) {
        setColumns(3);
      } else {
        setColumns(4);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const distributeItemsToColumns = () => {
    const columnArrays: CheatSheetItem[][] = Array.from({ length: columns }, () => []);
    
    items.forEach((item, index) => {
      const columnIndex = index % columns;
      columnArrays[columnIndex].push(item);
    });

    return columnArrays;
  };

  const columnArrays = distributeItemsToColumns();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`grid gap-6`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {columnArrays.map((columnItems, columnIndex) => (
          <div key={columnIndex} className="space-y-6">
            {columnItems.map((item) => {
              const originalIndex = items.findIndex(i => i.id === item.id);
              return (
                <CheatSheetCard
                  key={item.id}
                  item={item}
                  index={originalIndex}
                  onExpand={() => {
                    onCardExpand(item, originalIndex);
                  }}
                  isHovered={hoveredCard === item.id}
                  onHover={(hovered) => setHoveredCard(hovered ? item.id : null)}
                  onLinkClick={onLinkClick}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasonryGrid;