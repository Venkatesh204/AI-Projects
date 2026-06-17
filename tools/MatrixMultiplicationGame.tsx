

import React, { useState, useCallback } from 'react';
import { GameComponentProps, Matrix, DisplayMatrix } from '../types';
import MatrixInput from '../components/MatrixInput';
import MatrixDisplay from '../components/MatrixDisplay';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

const multiplyMatrices = (A: Matrix, B: Matrix): Matrix | null => {
    const rowsA = A.length;
    const colsA = A[0].length;
    const rowsB = B.length;
    const colsB = B[0].length;

    if (colsA !== rowsB) {
      return null; // Dimension mismatch for multiplication
    }

    const C: Matrix = Array(rowsA).fill(null).map(() => Array(colsB).fill(0));

    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsB; j++) {
        for (let k = 0; k < colsA; k++) { // Or k < rowsB
          C[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    return C;
};

const MatrixMultiplicationGame: React.FC<GameComponentProps & {onBack?: () => void}> = ({ moduleId, onGameComplete, onBack }) => {
  const initialMatrixA: Matrix = [[1, 2], [3, 4]]; // 2x2
  const initialMatrixB: Matrix = [[5, 6], [7, 8]]; // 2x2
  
  const [matrixA, setMatrixA] = useState<Matrix>(initialMatrixA);
  const [rowsA, setRowsA] = useState(initialMatrixA.length);
  const [colsA, setColsA] = useState(initialMatrixA[0].length);

  const [matrixB, setMatrixB] = useState<Matrix>(initialMatrixB);
  const [rowsB, setRowsB] = useState(initialMatrixB.length);
  const [colsB, setColsB] = useState(initialMatrixB[0].length);
  
  const [resultMatrix, setResultMatrix] = useState<DisplayMatrix | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleMatrixAChange = useCallback((newMatrix: Matrix, r: number, c: number) => {
    setMatrixA(newMatrix);
    setRowsA(r);
    setColsA(c);
    setResultMatrix(null); setError(null); setSuccessMessage(null);
  }, []);

  const handleMatrixBChange = useCallback((newMatrix: Matrix, r: number, c: number) => {
    setMatrixB(newMatrix);
    setRowsB(r);
    setColsB(c);
    setResultMatrix(null); setError(null); setSuccessMessage(null);
  }, []);

  const handleCalculate = () => {
    setError(null);
    setSuccessMessage(null);
    if (!matrixA || !matrixB || matrixA.flat().some(isNaN) || matrixB.flat().some(isNaN)) {
        setError("Invalid input: All matrix cells must contain valid numbers.");
        setResultMatrix(null);
        return;
    }
    if (colsA !== rowsB) {
      setError(`Dimension Mismatch: For A × B, columns of A (${colsA}) must equal rows of B (${rowsB}).`);
      setResultMatrix(null);
      return;
    }

    const res = multiplyMatrices(matrixA, matrixB);
    if (res) {
      setResultMatrix(res);
      setSuccessMessage("Matrices multiplied successfully! Result A × B is shown below.");
      if(onGameComplete) onGameComplete();
    } else {
      // This should be caught by the colsA !== rowsB check
      setError("An unexpected error occurred during multiplication.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 shadow-xl rounded-lg overflow-hidden">
      {onBack && (
            <div className="p-4 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
                <h2 className="text-xl font-semibold text-sky-300">Interactive Matrix Multiplication Tool</h2>
                <button onClick={onBack} className="btn btn-ghost p-2 text-sm flex items-center">
                    <ArrowLeft size={18} className="mr-1" /> Back to Module
                </button>
            </div>
        )}
      <main className="flex-grow p-4 overflow-y-auto custom-scrollbar space-y-6">
        {!onBack && <h2 className="text-xl font-semibold text-sky-300 text-center mb-2">Interactive Matrix Multiplication Tool</h2>}
        <p className="text-slate-300">
            Define Matrix A and Matrix B. For A × B to be valid, the number of columns in A must equal the number of rows in B.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
            <MatrixInput
                id="matrixA-mult-tool"
                title="Matrix A"
                initialRows={initialMatrixA.length}
                initialCols={initialMatrixA[0].length}
                onMatrixChange={handleMatrixAChange}
            />
            <MatrixInput
                id="matrixB-mult-tool"
                title="Matrix B"
                initialRows={initialMatrixB.length}
                initialCols={initialMatrixB[0].length}
                onMatrixChange={handleMatrixBChange}
            />
        </div>
      
        <div className="text-center my-6">
            <button onClick={handleCalculate} className="btn btn-primary text-lg px-8 py-3">
            Calculate A × B
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
                    matrixB={matrixB}
                    resultMatrix={resultMatrix}
                    operationSymbol="×"
                    matrixATitle={`Input A (${rowsA}x${colsA})`}
                    matrixBTitle={`Input B (${rowsB}x${colsB})`}
                    resultTitle={`A × B (${resultMatrix.length}x${resultMatrix[0].length})`}
                />
            </div>
        )}
      </main>
    </div>
  );
};

export default MatrixMultiplicationGame;
