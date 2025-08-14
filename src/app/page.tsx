'use client';

import React, { useState } from 'react';
import { cheatSheetData, CheatSheetItem } from '@/data/cheatsheet';
import MasonryGrid from '@/components/MasonryGrid';
import CardModal from '@/components/CardModal';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function Home() {
  const [selectedCard, setSelectedCard] = useState<CheatSheetItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardExpand = (item: CheatSheetItem, index: number) => {
    setSelectedCard(item);
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleNext = () => {
    if (selectedIndex < cheatSheetData.length - 1) {
      const nextIndex = selectedIndex + 1;
      setSelectedIndex(nextIndex);
      setSelectedCard(cheatSheetData[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1;
      setSelectedIndex(prevIndex);
      setSelectedCard(cheatSheetData[prevIndex]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      <DarkModeToggle />
      
      {/* Header */}
      <header className="text-center py-12 px-4">
        <h1 className="text-5xl md:text-6xl font-whimsy font-bold text-gray-800 dark:text-gray-100 mb-4">
          🤖 Understand AI for Devs
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          A developer&apos;s cheat sheet to understanding AI concepts, tools, and best practices
        </p>
      </header>

      {/* Main Content */}
      <main>
        <MasonryGrid 
          items={cheatSheetData} 
          onCardExpand={handleCardExpand}
        />
      </main>

      {/* Modal */}
      {selectedCard && (
        <CardModal
          item={selectedCard}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onNext={handleNext}
          onPrevious={handlePrevious}
          currentIndex={selectedIndex}
          totalItems={cheatSheetData.length}
        />
      )}

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
        <p>Navigate with keyboard arrows • Press ESC to close modal</p>
      </footer>
    </div>
  );
}