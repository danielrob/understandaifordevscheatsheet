'use client';

import React from 'react';
import { CheatSheetItem } from '@/data/cheatsheet';
import MarkdownRenderer from './MarkdownRenderer';

interface CheatSheetCardProps {
  item: CheatSheetItem;
  onExpand: () => void;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}

const CheatSheetCard: React.FC<CheatSheetCardProps> = ({ 
  item, 
  onExpand, 
  isHovered, 
  onHover 
}) => {
  const getCardColor = (type: string) => {
    switch (type) {
      case 'concept':
        return 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700';
      case 'technical':
        return 'bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700';
      case 'framework':
        return 'bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700';
      default:
        return 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'concept':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'technical':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'framework':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <div
      className={`
        relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ease-in-out
        hover:shadow-lg hover:scale-[1.02] transform
        ${getCardColor(item.type)}
        ${isHovered ? 'shadow-lg scale-[1.02]' : 'shadow-sm'}
      `}
      onClick={onExpand}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Expand Icon */}
      <div 
        className={`absolute top-3 right-3 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <svg
          className="w-5 h-5 text-gray-600 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      </div>

      {/* Type Badge */}
      <div className="mb-3">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
          {item.type}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-whimsy font-bold text-gray-800 dark:text-gray-100 mb-3 leading-tight">
        {item.title}
      </h3>

      {/* Content Preview */}
      <div className="text-sm text-gray-700 dark:text-gray-300 font-content line-clamp-4">
        <MarkdownRenderer content={item.content.substring(0, 200) + (item.content.length > 200 ? '...' : '')} />
      </div>
    </div>
  );
};

export default CheatSheetCard;