

import React, { useState, useCallback } from 'react';
import { GameComponentProps, Matrix, DisplayMatrix, MatrixValue } from '../types';
import MatrixInput from '../components/MatrixInput';
import MatrixDisplay from '../components/MatrixDisplay';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

const ScalarMultiplicationGame: React.FC<GameComponentProps & {onBack?: () => void}> = ({ moduleId, onGameComplete, onBack }) => {
  const initialMatrix: Matrix = [[1, 2], [3, 4]];
  const [matrixA, setMatrixA] = useState<Matrix>(initialMatrix);
  const [rowsA, setRowsA] = useState(initialMatrix.length);
  const [colsA, setColsA] = useState(initialMatrix[0].length);
  
  const [scalar, setScalar] = useState<number>(2);
  const [resultMatrix, setResultMatrix] = useState<DisplayMatrix | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleMatrixAChange = useCallback((newMatrix: Matrix, r: number, c: number) => {
    setMatrixA(newMatrix);
    setRowsA(r);
    setColsA(c);
    setResultMatrix(null);
    setError(null);
    setSuccessMessage(null);
  }, []);

  const handleScalarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setScalar(isNaN(val) ? 0 : val); // Default to 0 if input is not a number
    setResultMatrix(null);
    setError(null);
    setSuccessMessage(null);
  };

  const calculateResult = () => {
    setError(null);
    setSuccessMessage(null);
    if (isNaN(scalar)) {
      setError("Invalid scalar: Please enter a numeric value for the scalar.");
      setResultMatrix(null);
      return;
    }
    if (!matrixA || matrixA.flat().some(isNaN)) {
        setError("Invalid input: All matrix cells must contain valid numbers.");
        setResultMatrix(null);
        return;
    }

    const res = matrixA.map(row => row.map(cell => cell * scalar));
    setResultMatrix(res);
    setSuccessMessage(`Scalar ${scalar} multiplied by Matrix A! Result is shown below.`);
    if(onGameComplete) onGameComplete();
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 shadow-xl rounded-lg overflow-hidden">
        {onBack && ( /* Conditional rendering for back button if needed in this context */
             <div className="p-4 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
                <h2 className="text-xl font-semibold text-sky-300">Interactive Scalar Multiplication Tool</h2>
                <button onClick={onBack} className="btn btn-ghost p-2 text-sm flex items-center">
                    <ArrowLeft size={18} className="mr-1" /> Back to Module
                </button>
            </div>
        )}
       <main className="flex-grow p-4 overflow-y-auto custom-scrollbar space-y-6">
        {!onBack && <h2 className="text-xl font-semibold text-sky-300 text-center mb-2">Interactive Scalar Multiplication Tool</h2>}
        <p className="text-slate-300">
            Define a matrix and a scalar value. Then, click 'Multiply by Scalar' to see each element of the matrix scaled by the scalar.
        </p>
        
        <MatrixInput
            id="matrixA-scalar-tool"
            title="Matrix A"
            initialRows={initialMatrix.length}
            initialCols={initialMatrix[0].length}
            onMatrixChange={handleMatrixAChange}
        />

        <div className="my-4">
            <label htmlFor="scalarInput" className="block text-sm font-medium text-slate-300 mb-1">Enter Scalar Value (k):</label>
            <input 
                id="scalarInput"
                type="number"
                value={scalar}
                onChange={handleScalarChange}
                className="input-field md:w-1/3 w-full"
                aria-label="Scalar value for multiplication"
            />
        </div>
        
        <div className="text-center my-6">
            <button onClick={calculateResult} className="btn btn-primary text-lg px-8 py-3">
                Multiply by Scalar (k × A)
            </button>
        </div>

        {error && (
            <div className="p-4 rounded-md bg-red-700/30 text-red-300 border border-red-500 flex items-start">
                 <AlertTriangle size={20} className="mr-2 shrink-0 mt-1" />
                <div><h5 className="font-semibold">Error</h5><p className="text-sm">{error}</p></div>
            </div>
        )}
        {successMessage && !error && (
            <div className="p-4 rounded-md bg-green-700/30 text-green-300 border border-green-500 flex items-start">
                <CheckCircle size={20} className="mr-2 shrink-0 mt-1" />
                <div><h5 className="font-semibold">Success</h5><p className="text-sm">{successMessage}</p></div>
            </div>
        )}

        {resultMatrix && !error && (
            <div className="mt-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-2 text-center">Result</h3>
                <MatrixDisplay
                    matrixA={matrixA}
                    scalar={scalar}
                    matrixATitle="Input A"
                    resultMatrix={resultMatrix}
                    resultTitle={`Result (${scalar} × A)`}
                />
            </div>
        )}
      </main>
    </div>
  );
};

export default ScalarMultiplicationGame;
