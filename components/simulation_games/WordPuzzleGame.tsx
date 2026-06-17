
import React, { useState, useEffect, FormEvent, FC, useCallback } from 'react';
import { SimulationGameComponentProps, GridCrafterScenario, Matrix, DisplayMatrix, ModuleId } from '../../types';
import { modules } from '../../data/modulesContent';
import { iconMap } from '../../utils/iconMap';
import MatrixDisplay from '../MatrixDisplay';
import { OPERATION_SYMBOLS } from '../../constants';
import { CheckCircle } from 'lucide-react';

const GridCrafterGame: FC<SimulationGameComponentProps> = ({ moduleId, onBackToModule, gameConfig }) => {
  const [scenario, setScenario] = useState<GridCrafterScenario | null>(null);
  const [userInputs, setUserInputs] = useState<string[][]>([]);
  const [feedbackGrid, setFeedbackGrid] = useState<('correct' | 'incorrect' | 'neutral')[][]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeGame = useCallback((currentScenario: GridCrafterScenario) => {
    const { targetMatrix } = currentScenario;
    const initialInputs = targetMatrix.map(row => row.map(() => ''));
    const initialFeedback = targetMatrix.map(row => row.map((): 'neutral' => 'neutral'));
    setUserInputs(initialInputs);
    setFeedbackGrid(initialFeedback);
    setIsComplete(false);
    setError(null);
  }, []);

  useEffect(() => {
    const module = modules.find(m => m.id === moduleId);
    if (module && module.gridCrafterScenario) {
      setScenario(module.gridCrafterScenario);
      initializeGame(module.gridCrafterScenario);
    } else {
      setError("Could not load the simulation scenario for this module.");
    }
  }, [moduleId, initializeGame]);

  const handleInputChange = (r: number, c: number, value: string) => {
    if (isComplete) return;
    const newInputs = userInputs.map(row => [...row]);
    newInputs[r][c] = value;
    setUserInputs(newInputs);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!scenario) return;

    let allCorrect = true;
    const newFeedbackGrid = scenario.targetMatrix.map((row, r) =>
      row.map((cell, c) => {
        const userValue = parseFloat(userInputs[r][c]);
        const isCorrect = Math.abs(userValue - cell) < 0.01;
        if (!isCorrect) allCorrect = false;
        return isCorrect ? 'correct' : 'incorrect';
      })
    );
    setFeedbackGrid(newFeedbackGrid);
    if(allCorrect) {
        setIsComplete(true);
    }
  };
  
  const handleReset = () => {
    if (scenario) {
      initializeGame(scenario);
    }
  };

  if (error) {
    return <div className="p-6 text-center text-red-400">{error}</div>;
  }

  if (!scenario) {
    return <div className="p-6 text-center text-slate-400">Loading simulation...</div>;
  }

  const { title, description, worldMatrix, operatorMatrix, operatorScalar, targetMatrix, visualMap } = scenario;
  const isMultiplication = moduleId === 'matrixMultiplication';
  const ResetIcon = iconMap['RotateCcw'];

  const operationMap: Record<ModuleId, keyof typeof OPERATION_SYMBOLS> = {
    addition: 'add',
    subtraction: 'subtract',
    scalarMultiplication: 'scalarMultiply',
    matrixMultiplication: 'multiply',
  };
  const operationSymbol = operationMap[moduleId];

  const renderGridInput = () => (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${targetMatrix[0].length}, minmax(0, 1fr))` }}>
      {targetMatrix.map((row, r) =>
        row.map((_, c) => {
          let cellClass = "input-field text-center p-2 h-12 w-full min-w-[60px] text-lg bg-slate-100 text-slate-900 font-medium border-slate-400 placeholder-slate-500";
          const feedback = feedbackGrid[r]?.[c];
          if (feedback === 'correct') {
            cellClass += " bg-green-700/50 border-green-500 focus:ring-green-400 text-white";
          } else if (feedback === 'incorrect') {
            cellClass += " bg-red-700/50 border-red-500 focus:ring-red-400 animate-shake text-white";
          } else {
            cellClass += " focus:ring-yellow-400";
          }

          return (
            <input
              key={`input-${r}-${c}`}
              type="number"
              step="any"
              value={userInputs[r]?.[c] || ''}
              onChange={(e) => handleInputChange(r, c, e.target.value)}
              className={cellClass}
              aria-label={`Result cell row ${r + 1} column ${c + 1}`}
              disabled={isComplete}
              required
            />
          );
        })
      )}
    </div>
  );

  const renderVisualGrid = (matrix: Matrix, gridTitle: string) => (
    <div className="flex flex-col items-center">
        <h4 className="text-md font-semibold text-sky-300 mb-2">{gridTitle}</h4>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${matrix[0].length}, minmax(0, 1fr))` }}>
            {matrix.map((row, r) =>
                row.map((cell, c) => (
                    <div key={`vis-${r}-${c}`} className={`w-12 h-12 flex items-center justify-center rounded-md transition-colors duration-300 ${visualMap(cell).className}`}>
                        <span className="font-bold text-white/90" style={{textShadow: '1px 1px 2px black'}}>{cell}</span>
                    </div>
                ))
            )}
        </div>
    </div>
  );

  return (
    <div className="card p-4 md:p-6 space-y-4">
      <h3 className="text-xl md:text-2xl font-bold text-purple-300 text-center">{gameConfig.title}: {title}</h3>
      <p className="text-slate-300 text-center text-sm md:text-base">{description}</p>
      
      <div className="flex flex-col md:flex-row items-center justify-center flex-wrap gap-4 md:gap-6 p-4 bg-slate-700/50 rounded-lg">
        {isMultiplication ? (
            <MatrixDisplay
              matrixA={worldMatrix}
              matrixB={operatorMatrix}
              operationSymbol={OPERATION_SYMBOLS['multiply']}
              matrixATitle="Orders"
              matrixBTitle="Resource Costs"
            />
        ) : (
          <>
            {renderVisualGrid(worldMatrix, "Initial State (World)")}
            <div className="text-3xl font-bold text-yellow-400 mx-2">
              {operatorMatrix ? OPERATION_SYMBOLS[operationSymbol] : OPERATION_SYMBOLS['scalarMultiply']}
            </div>
            {operatorMatrix && renderVisualGrid(operatorMatrix, "Operator")}
            {operatorScalar !== undefined && (
              <div className="flex flex-col items-center">
                <h4 className="text-md font-semibold text-sky-300 mb-2">Scalar</h4>
                <div className="w-12 h-12 flex items-center justify-center rounded-md bg-sky-600">
                  <span className="text-2xl font-bold text-white">{operatorScalar}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <h4 className="text-lg font-semibold text-yellow-400 text-center">
            {isMultiplication ? "Calculate the Total Resources needed:" : "Calculate the final state of the grid:"}
        </h4>
        <div className="flex justify-center p-2">
            {renderGridInput()}
        </div>
        
        {!isComplete && (
            <div className="text-center">
                <button type="submit" className="btn btn-primary text-lg px-8">Check My Work</button>
            </div>
        )}
      </form>

      {isComplete && (
         <div className="p-4 my-3 rounded-md bg-green-700/50 text-green-200 border border-green-600 text-center flex flex-col items-center gap-2">
            <CheckCircle className="text-green-300" size={32}/>
            <h4 className="text-xl font-bold">Simulation Complete!</h4>
            <p>Excellent work! You've correctly applied the matrix operation.</p>
        </div>
      )}

      <div className="mt-6 flex justify-center items-center space-x-4">
        <button onClick={handleReset} className="btn btn-secondary">
          <ResetIcon size={18} className="mr-2 inline" />
          Reset Simulation
        </button>
        <button onClick={onBackToModule} className="btn btn-ghost">Back to Module</button>
      </div>
    </div>
  );
};

export default GridCrafterGame;
