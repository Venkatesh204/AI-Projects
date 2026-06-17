
import React, { useState, useEffect } from 'react';
import { SimulationGameComponentProps } from '../../types';
import { gameCardStyle, gameTitleStyle, gameInstructionStyle, flashcardFrontStyle, flashcardBackStyle, secondaryButtonStyle, buttonStyle } from './commonStyles';
import { RotateCcw, ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';
import { iconMap } from '../../utils/iconMap';

const FlashcardsGame: React.FC<SimulationGameComponentProps> = ({ moduleId, gameData, onBackToModule, gameConfig }) => {
  const [flashcards, setFlashcards] = useState(gameData?.flashcards || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Shuffle cards on load or when module/data changes
    const currentCards = gameData?.flashcards || [];
    setFlashcards(currentCards.sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  }, [gameData, moduleId]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowHint(false); // Hide hint when card is flipped
  };

  const handleNext = () => {
    if (flashcards.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const handlePrev = () => {
    if (flashcards.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
      setIsFlipped(false);
      setShowHint(false);
    }
  };
  
  const handleReset = () => {
    const currentCards = gameData?.flashcards || [];
    setFlashcards(currentCards.sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  };

  if (flashcards.length === 0) {
    return (
      <div className={gameCardStyle}>
        <h2 className={gameTitleStyle}>{gameConfig.title}</h2>
        <p className={gameInstructionStyle}>No flashcards available for this module yet. 🧐</p>
        <button onClick={onBackToModule} className={buttonStyle}>Back to Module</button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const HintIcon = iconMap['Lightbulb'];

  return (
    <div className={gameCardStyle}>
      <h2 className={gameTitleStyle}>{gameConfig.title}</h2>
      <p className={gameInstructionStyle}>Click the card to flip it. Use arrows to navigate.</p>
      
      <div className="relative mb-6 h-48 md:h-56" style={{ perspective: '1000px' }}>
         <button
            onClick={handleFlip}
            className={'w-full h-full transition-transform duration-500 ease-in-out'}
            style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            aria-live="polite"
            aria-label={`Flashcard ${currentIndex + 1} of ${flashcards.length}. Front: ${currentCard.front}. Back: ${currentCard.back}. Card is currently showing ${isFlipped ? 'back' : 'front'}. Click to flip.`}
            title="Click to flip"
        >
            {/* Front Side */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center text-center p-4 rounded-lg bg-yellow-700/80" style={{ backfaceVisibility: 'hidden' }}>
                <p className={flashcardFrontStyle}>{currentCard.front}</p>
            </div>

            {/* Back Side */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center text-center p-4 rounded-lg bg-sky-800" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <p className={flashcardBackStyle}>{currentCard.back}</p>
            </div>
        </button>
        {!isFlipped && (
             <button 
                onClick={() => setShowHint(true)} 
                className="absolute top-2 right-2 btn btn-ghost p-1 text-yellow-300 hover:text-yellow-100 z-10"
                aria-label="Show hint"
                title="Show hint for the back of the card"
            >
                <HintIcon size={20} />
            </button>
        )}
      </div>

       {showHint && !isFlipped && (
        <div className="p-2 mb-4 rounded-md bg-slate-600 text-sm text-slate-300 text-center">
          Hint: The other side says "{currentCard.back.substring(0, 30)}{currentCard.back.length > 30 ? '...' : ''}"
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <button onClick={handlePrev} className={secondaryButtonStyle} aria-label="Previous card">
          <ArrowLeft size={20} className="mr-1 inline"/> Prev
        </button>
        <p className="text-slate-400">{currentIndex + 1} / {flashcards.length}</p>
        <button onClick={handleNext} className={secondaryButtonStyle} aria-label="Next card">
          Next <ArrowRight size={20} className="ml-1 inline"/>
        </button>
      </div>

      <div className="flex justify-center space-x-4">
        <button onClick={handleReset} className={secondaryButtonStyle} aria-label="Reset and shuffle cards">
          <RotateCcw size={18} className="mr-2 inline"/> Shuffle All
        </button>
        <button onClick={onBackToModule} className={buttonStyle}>Back to Module</button>
      </div>
    </div>
  );
};

export default FlashcardsGame;
