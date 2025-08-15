'use client';

import React, { useEffect } from 'react';
import { CheatSheetItem } from '@/data/cheatsheet';
import MarkdownRenderer from './MarkdownRenderer';

interface CardModalProps {
  item: CheatSheetItem;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalItems: number;
  onLinkClick?: (cardId: string) => void;
  onBack?: () => void;
  hasNavigationHistory: boolean;
}

const CardModal: React.FC<CardModalProps> = ({
  item,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  currentIndex,
  totalItems,
  onLinkClick,
  onBack,
  hasNavigationHistory,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getCardColor = (index: number) => {
    const colorIndex = index % 3;
    switch (colorIndex) {
      case 0:
        return 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-900 border-green-200 dark:border-green-700';
      case 1:
        return 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700';
      case 2:
        return 'bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-700';
      default:
        return 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrevious();
        }}
        disabled={currentIndex === 0}
        className="absolute left-6 z-10 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        disabled={currentIndex === totalItems - 1}
        className="absolute right-6 z-10 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Modal Content */}
      <div 
        className="relative w-full max-w-4xl mx-6 max-h-[80vh] min-h-[45vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`
          rounded-2xl border-2 shadow-2xl p-8 transition-all duration-300 min-h-[45vh] flex flex-col
          ${getCardColor(currentIndex)}
        `}>
          {/* Back Button */}
          {hasNavigationHistory && onBack && (
            <button
              onClick={onBack}
              className="absolute top-3 left-3 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-60 hover:opacity-100"
              title="Go back to previous card"
            >
              <span className="text-lg text-gray-500 dark:text-gray-400">←</span>
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Title */}
              <h2 className="text-3xl font-whimsy font-bold text-gray-800 dark:text-gray-100 leading-tight mt-2">
                {item.title}
              </h2>

              {/* Content */}
              <div className="text-base text-gray-700 dark:text-gray-300 font-content leading-relaxed">
                <MarkdownRenderer content={item.content} onLinkClick={onLinkClick} />
              </div>
            </div>

            {/* Progress Indicator - Always at bottom */}
            <div className="flex items-center justify-center space-x-2 pt-6 mt-auto">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentIndex + 1} of {totalItems}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;