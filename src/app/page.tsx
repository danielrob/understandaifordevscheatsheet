'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cheatSheetData, CheatSheetItem } from '@/data/cheatsheet';
import MasonryGrid from '@/components/MasonryGrid';
import CardModal from '@/components/CardModal';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCard, setSelectedCard] = useState<CheatSheetItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  // Initialize state from URL on component mount
  useEffect(() => {
    const cardId = searchParams.get('card');
    if (cardId) {
      const cardIndex = cheatSheetData.findIndex(item => item.id === cardId);
      if (cardIndex !== -1) {
        const card = cheatSheetData[cardIndex];
        setSelectedCard(card);
        setSelectedIndex(cardIndex);
        setIsModalOpen(true);
      }
    }
  }, [searchParams]);

  const updateURL = (cardId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cardId) {
      params.set('card', cardId);
    } else {
      params.delete('card');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleCardExpand = (item: CheatSheetItem, index: number) => {
    setSelectedCard(item);
    setSelectedIndex(index);
    setIsModalOpen(true);
    setNavigationHistory([]); // Clear navigation history on direct card expansion
    updateURL(item.id);
  };

  const handleLinkClick = (cardId: string) => {
    const cardIndex = cheatSheetData.findIndex(item => item.id === cardId);
    if (cardIndex !== -1) {
      const card = cheatSheetData[cardIndex];
      // Add current card to navigation history when following a link
      if (selectedCard && selectedCard.id !== cardId) {
        setNavigationHistory(prev => [...prev, selectedCard.id]);
      }
      setSelectedCard(card);
      setSelectedIndex(cardIndex);
      setIsModalOpen(true);
      updateURL(cardId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
    setNavigationHistory([]);  // Clear navigation history when closing modal
    updateURL(null);
  };

  const handleBackClick = () => {
    if (navigationHistory.length > 0) {
      const previousCardId = navigationHistory[navigationHistory.length - 1];
      const cardIndex = cheatSheetData.findIndex(item => item.id === previousCardId);
      if (cardIndex !== -1) {
        const card = cheatSheetData[cardIndex];
        setSelectedCard(card);
        setSelectedIndex(cardIndex);
        setNavigationHistory(prev => prev.slice(0, -1)); // Remove last item from history
        updateURL(previousCardId);
      }
    }
  };

  const handleNext = () => {
    if (selectedIndex < cheatSheetData.length - 1) {
      const nextIndex = selectedIndex + 1;
      const nextCard = cheatSheetData[nextIndex];
      setSelectedIndex(nextIndex);
      setSelectedCard(nextCard);
      setNavigationHistory([]); // Clear navigation history on standard navigation
      updateURL(nextCard.id);
    }
  };

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1;
      const prevCard = cheatSheetData[prevIndex];
      setSelectedIndex(prevIndex);
      setSelectedCard(prevCard);
      setNavigationHistory([]); // Clear navigation history on standard navigation
      updateURL(prevCard.id);
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
          onLinkClick={handleLinkClick}
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
          onLinkClick={handleLinkClick}
          onBack={handleBackClick}
          hasNavigationHistory={navigationHistory.length > 0}
        />
      )}

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
        <p>Navigate with keyboard arrows • Press ESC to close modal</p>
      </footer>
    </div>
  );
}