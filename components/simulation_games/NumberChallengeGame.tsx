
import React, { useState, useEffect, FormEvent } from 'react';
import { SimulationGameComponentProps, Matrix, MatrixPosition, Operation } from '../../types';
import MatrixDisplay from '../MatrixDisplay'; // Re-use for displaying matrices if needed
import { gameCardStyle, gameTitleStyle, gameInstructionStyle, inputStyle, buttonStyle, feedbackCorrectStyle, feedbackIncorrectStyle, secondaryButtonStyle, feedbackNeutralStyle } from './commonStyles';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { iconMap } from '../../utils/iconMap';


const NumberChallengeGame: React.FC<SimulationGameComponentProps> = ({ moduleId, gameData, onBackToModule, gameConfig }) => {
  const [challenges, setChallenges] = useState(gameData?.numberChallenges || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const currentChallenges = gameData?.numberChallenges || [];
    setChallenges(currentChallenges.sort(() => Math.random() - 0.5)); // Shuffle
    setCurrentIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setIsCorrect(null);
    setScore(0);
    setAttempts(0);
  }, [gameData, moduleId]);

  const currentChallenge = challenges[currentIndex];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentChallenge || isCorrect !== null) return;

    setAttempts(prev => prev + 1);
    const expected = currentChallenge.expectedAnswer;
    const userAnswerNum = parseFloat(userAnswer);

    if (!isNaN(userAnswerNum) && userAnswerNum === expected) {
      setFeedback(`Correct! ${currentChallenge.textPrompt} = ${expected} 🎉`);
      setIsCorrect(true);
      setScore(prev => prev + 1);
    } else {
      setFeedback(`Not quite. The correct answer is ${expected}.`);
      setIsCorrect(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setFeedback(null);
      setIsCorrect(null);
    } else {
      setFeedback(`Challenge set finished! Your score: ${score}/${challenges.length}`);
    }
  };
  
  const handleReset = () => {
     setChallenges(challenges.sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setIsCorrect(null);
    setScore(0);
    setAttempts(0);
  };

  if (challenges.length === 0) {
    return (
      <div className={gameCardStyle}>
        <h2 className={gameTitleStyle}>{gameConfig.title}</h2>
        <p className={gameInstructionStyle}>No number challenges available for this module yet. 🔢</p>
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
      <p className={gameInstructionStyle}>Solve the calculation.</p>

      <div className="my-4 p-4 bg-slate-800 rounded-md text-center">
        {currentChallenge?.matrixA && (
          <div className="my-2 flex justify-center">
            <MatrixDisplay
              matrixA={currentChallenge.matrixA}
              matrixB={currentChallenge.matrixB}
              operationSymbol={currentChallenge.operation === 'add' ? '+' : currentChallenge.operation === 'subtract' ? '-' : currentChallenge.operation === 'multiply' && currentChallenge.scalar ? `× ${currentChallenge.scalar}` : currentChallenge.operation === 'multiply' ? '×' : undefined }
              matrixATitle={currentChallenge.scalar !== undefined ? "Matrix" : "Matrix A"}
              matrixBTitle={currentChallenge.matrixB ? "Matrix B" : undefined}
              hidePlaceholders
            />
          </div>
        )}
        <p className="text-xl text-yellow-300 font-semibold">{currentChallenge?.textPrompt}</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="number" // Allow float/decimals too
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className={inputStyle}
          placeholder="Your answer"
          aria-label="Your numerical answer"
          disabled={isCorrect !== null}
          step="any" // Allow decimal inputs
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

      {isCorrect !== null && currentIndex < challenges.length -1 && (
        <button onClick={handleNext} className={buttonStyle + " w-full max-w-sm mx-auto block"}>
          Next Challenge &rarr;
        </button>
      )}
       {isCorrect !== null && currentIndex === challenges.length -1 && (
         <p className={`${feedbackNeutralStyle} font-semibold`}>Game Over! Final Score: {score} / {challenges.length}</p>
      )}

      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <p className="text-sm text-slate-400">Score: {score}/{attempts} ({challenges.length} challenges)</p>
        <button onClick={handleReset} className={secondaryButtonStyle}>
           <ResetIcon size={18} className="mr-2 inline"/> Reset Challenges
        </button>
        <button onClick={onBackToModule} className={buttonStyle}>Back to Module</button>
      </div>
    </div>
  );
};

export default NumberChallengeGame;