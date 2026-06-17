
import React, { useState, useEffect, FormEvent, FC } from 'react';
import { RealLifeExample, ModuleId, DisplayMatrix, MatrixPosition } from '../types';
import MatrixDisplay from './MatrixDisplay';
import { OPERATION_SYMBOLS } from '../constants';
import { CheckCircle, XCircle, Lightbulb, RotateCcw, ChevronDown } from 'lucide-react';

interface InteractiveExampleProps {
  example: RealLifeExample;
  moduleId: ModuleId;
  isInitiallyOpen?: boolean;
}

const InteractiveExample: FC<InteractiveExampleProps> = ({ example, moduleId, isInitiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);
  const [userResult, setUserResult] = useState<DisplayMatrix>([]);
  const [currentFocus, setCurrentFocus] = useState<MatrixPosition | null>({ row: 0, col: 0 });
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | 'info'; message: string | React.ReactNode } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [highlightedCells, setHighlightedCells] = useState<any[]>([]);

  const getCorrectValue = (pos: MatrixPosition): number => {
    return example.resultMatrix[pos.row][pos.col];
  };
  
  const updateHighlights = (focus: MatrixPosition | null) => {
    if (!focus || example.operation !== 'multiply' || !example.matrixA || !example.matrixB) {
      setHighlightedCells([]);
      return;
    }
    const highlights = [
      { matrix: 'A', positions: example.matrixA[focus.row].map((_, c) => ({ row: focus.row, col: c })) },
      { matrix: 'B', positions: example.matrixB.map((_, r) => ({ row: r, col: focus.col })) }
    ];
    setHighlightedCells(highlights);
  };

  const initialize = () => {
    const { resultMatrix } = example;
    const initialResult = resultMatrix.map(row => row.map(() => '?'));
    setUserResult(initialResult);
    const initialFocus = { row: 0, col: 0 };
    setCurrentFocus(initialFocus);
    setUserInput('');
    setFeedback(null);
    setIsComplete(false);
    updateHighlights(initialFocus);
  };
  
  useEffect(initialize, [example]);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isComplete || currentFocus === null || userInput.trim() === '') return;

    const correctValue = getCorrectValue(currentFocus);
    const userValue = parseFloat(userInput);

    if (Math.abs(userValue - correctValue) < 0.01) { // Floating point comparison
      setFeedback({ type: 'correct', message: 'Correct! Great job!' });
      const newUserResult = userResult.map(r => [...r]);
      newUserResult[currentFocus.row][currentFocus.col] = `✅${correctValue}`;
      setUserResult(newUserResult);

      const { resultMatrix } = example;
      const rows = resultMatrix.length;
      const cols = resultMatrix[0].length;
      let nextRow = currentFocus.row;
      let nextCol = currentFocus.col + 1;
      if (nextCol >= cols) {
        nextCol = 0;
        nextRow++;
      }

      if (nextRow >= rows) {
        setCurrentFocus(null);
        setIsComplete(true);
        setFeedback({ type: 'correct', message: 'Excellent! You have solved the example! 🎉' });
        updateHighlights(null);
      } else {
        const nextFocus = { row: nextRow, col: nextCol };
        setCurrentFocus(nextFocus);
        updateHighlights(nextFocus);
      }
      setUserInput('');
    } else {
      setFeedback({ type: 'incorrect', message: 'Not quite. Try that calculation again!' });
    }
  };

  const getPrompt = (): React.ReactNode => {
    if (isComplete || !currentFocus) return "You've completed this example!";
    const { row, col } = currentFocus;
    const { operation, scalar, matrixA, matrixB } = example;

    switch (operation) {
      case 'add':
        return `Calculate Result(${row + 1}, ${col + 1}): What is ${matrixA![row][col]} + ${matrixB![row][col]}?`;
      case 'subtract':
        return `Calculate Result(${row + 1}, ${col + 1}): What is ${matrixA![row][col]} - ${matrixB![row][col]}?`;
      case 'scalarMultiply':
        return `Calculate Result(${row + 1}, ${col + 1}): What is ${scalar} × ${matrixA![row][col]}?`;
      case 'multiply':
        const calculation = matrixA![row].map((val, k) => `${val} × ${matrixB![k][col]}`).join(' + ');
        return (
            <div className="text-center">
                <p className="font-semibold">Calculate Result({row + 1}, {col + 1})</p>
                <p className="text-xs mt-1 text-slate-400">This is the dot product of the highlighted row and column.</p>
                <p className="text-xs font-mono bg-slate-800 p-1 rounded mt-1 inline-block">Calculation: {calculation}</p>
            </div>
        );
      default:
        return 'Enter the value for the highlighted cell.';
    }
  };
  
  const renderFeedback = () => {
    if (!feedback) return <div className="h-[46px]"></div>; // Reserve space
    const baseStyle = 'p-3 my-3 rounded-md transition-all duration-300 ease-in-out text-sm flex items-center justify-center gap-2';
    let specificStyle = '';
    let Icon;

    switch(feedback.type) {
      case 'correct':
        specificStyle = 'bg-green-700/50 text-green-200 border border-green-600'; Icon = CheckCircle; break;
      case 'incorrect':
        specificStyle = 'bg-red-700/50 text-red-300 border border-red-500 animate-shake'; Icon = XCircle; break;
      case 'info':
        specificStyle = 'bg-sky-700/50 text-sky-200 border border-sky-600'; Icon = Lightbulb; break;
    }
    return (
      <div className={`${baseStyle} ${specificStyle}`}>
        <Icon size={18} />
        {feedback.message}
      </div>
    );
  };

  return (
    <div className="bg-slate-700/50 rounded-lg transition-all duration-300">
      <button 
        className="w-full p-4 text-left flex justify-between items-center text-md font-semibold text-yellow-400 hover:bg-slate-600/30 rounded-t-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`example-${example.id}`}
      >
        <span>{example.title}</span>
        <ChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div id={`example-${example.id}`} className="p-4 border-t border-slate-600/50">
          <div
            className="prose prose-sm prose-invert max-w-none text-slate-300 mb-4"
            dangerouslySetInnerHTML={{ __html: example.descriptionHTML }}
          />

          <div className="mt-4 border-t border-slate-600 pt-4">
            <MatrixDisplay
              matrixA={example.matrixA}
              matrixB={example.matrixB}
              scalar={example.scalar}
              resultMatrix={userResult}
              operationSymbol={example.matrixB ? OPERATION_SYMBOLS[example.operation] : undefined}
              currentFocus={currentFocus}
              highlightCells={highlightedCells}
              matrixATitle={example.scalar !== undefined ? "Matrix" : "Matrix A"}
              matrixBTitle={example.matrixB ? "Matrix B" : undefined}
              resultTitle="Your Result"
            />
            
            {renderFeedback()}
            
            {!isComplete && currentFocus ? (
              <form onSubmit={handleSubmit} className="mt-2 p-4 bg-slate-800/60 rounded-lg">
                <div className="mb-3 text-slate-200">{getPrompt()}</div>
                <div className="flex gap-2 justify-center">
                  <input
                    type="number"
                    step="any"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="input-field w-48 text-center bg-slate-100 text-slate-900 font-medium border-slate-400 placeholder-slate-500 focus:ring-yellow-400 focus:border-yellow-400"
                    placeholder="Enter value"
                    aria-label="Your answer for the current cell"
                    required
                    autoFocus
                    onFocus={(e) => e.target.select()}
                  />
                  <button type="submit" className="btn btn-primary">Check</button>
                </div>
              </form>
            ) : (
              <div className="mt-4 text-center">
                <button onClick={initialize} className="btn btn-secondary">
                  <RotateCcw className="inline mr-2" size={16} />
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveExample;
