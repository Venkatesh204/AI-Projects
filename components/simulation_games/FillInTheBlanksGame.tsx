
import React, { useState, useEffect, FormEvent } from 'react';
import { SimulationGameComponentProps } from '../../types';
import { gameCardStyle, gameTitleStyle, gameInstructionStyle, inputStyle, buttonStyle, feedbackCorrectStyle, feedbackIncorrectStyle, secondaryButtonStyle, feedbackNeutralStyle } from './commonStyles';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { iconMap } from '../../utils/iconMap';

const FillInTheBlanksGame: React.FC<SimulationGameComponentProps> = ({ moduleId, gameData, onBackToModule, gameConfig }) => {
  const [fillIns, setFillIns] = useState(gameData?.fillIns || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const currentFillIns = gameData?.fillIns || [];
    setFillIns(currentFillIns.sort(() => Math.random() - 0.5)); // Shuffle
    setCurrentIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setIsCorrect(null);
    setScore(0);
    setAttempts(0);
  }, [gameData, moduleId]);

  const currentFillIn = fillIns[currentIndex];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentFillIn || isCorrect !== null) return; // Already answered

    setAttempts(prev => prev + 1);
    if (userAnswer.trim().toLowerCase() === currentFillIn.blankAnswer.toLowerCase()) {
      setFeedback('Correct! 🎉');
      setIsCorrect(true);
      setScore(prev => prev + 1);
    } else {
      setFeedback(`Not quite. The answer is: ${currentFillIn.blankAnswer}.`);
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < fillIns.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setFeedback(null);
      setIsCorrect(null);
    } else {
      // End of game
      setFeedback(`Quiz finished! Your score: ${score}/${fillIns.length}`);
    }
  };

  const handleReset = () => {
    setFillIns(fillIns.sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setIsCorrect(null);
    setScore(0);
    setAttempts(0);
  };
  
  if (fillIns.length === 0) {
    return (
      <div className={gameCardStyle}>
        <h2 className={gameTitleStyle}>{gameConfig.title}</h2>
        <p className={gameInstructionStyle}>No fill-in-the-blank questions available for this module yet. 🤔</p>
        <button onClick={onBackToModule} className={buttonStyle}>Back to Module</button>
      </div>
    );
  }
  
  const CorrectIcon = iconMap['CheckCircle'];
  const IncorrectIcon = iconMap['XCircle'];
  const ResetIcon = iconMap['RotateCcw'];


  return (
    <div className={gameCardStyle}>
      <h2 className={gameTitleStyle}>{gameConfig.title}</h2>
      <p className={gameInstructionStyle}>Fill in the blank with the correct term.</p>
      
      <div className="my-4 p-4 bg-slate-800 rounded-md">
        <p className="text-lg text-slate-200 text-center">
            {currentFillIn?.sentenceParts[0]} 
            <span className="inline-block bg-slate-600 text-slate-600 rounded mx-1 px-2 min-w-[80px] text-center select-none">
                {currentFillIn?.blankAnswer.replace(/./g, '_')}
            </span> 
            {currentFillIn?.sentenceParts[1]}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className={inputStyle}
          placeholder="Type your answer"
          aria-label="Your answer for the blank"
          disabled={isCorrect !== null}
        />
        {isCorrect === null && (
          <button type="submit" className={buttonStyle + " w-full max-w-sm mx-auto block"}>
            Check Answer
          </button>
        )}
      </form>

      {feedback && (
        <div className={isCorrect ? feedbackCorrectStyle : feedbackIncorrectStyle}>
          {isCorrect ? <CorrectIcon className="inline mr-2" size={20}/> : <IncorrectIcon className="inline mr-2" size={20}/>}
          {feedback}
        </div>
      )}

      {isCorrect !== null && currentIndex < fillIns.length -1 && (
        <button onClick={handleNext} className={buttonStyle + " w-full max-w-sm mx-auto block"}>
          Next Question &rarr;
        </button>
      )}
      {isCorrect !== null && currentIndex === fillIns.length -1 && (
         <p className={`${feedbackNeutralStyle} font-semibold`}>Game Over! Final Score: {score} / {fillIns.length}</p>
      )}


      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
         <p className="text-sm text-slate-400">Score: {score}/{attempts} ({fillIns.length} questions)</p>
        <button onClick={handleReset} className={secondaryButtonStyle}>
           <ResetIcon size={18} className="mr-2 inline"/> Reset Game
        </button>
        <button onClick={onBackToModule} className={buttonStyle}>Back to Module</button>
      </div>
    </div>
  );
};

export default FillInTheBlanksGame;