
import React, { useState, useCallback } from 'react';
import { Matrix, DisplayMatrix, InteractiveGameProps } from '../types';
import MatrixInput from '../components/MatrixInput';
import MatrixDisplay from '../components/MatrixDisplay';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

// Helper function for matrix addition/subtraction
const performOperation = (matrixA: Matrix, matrixB: Matrix, operation: 'add' | 'subtract'): Matrix | null => {
  if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
    return null; // Dimension mismatch
  }
  return matrixA.map((row, r) =>
    row.map((cell, c) => {
      if (operation === 'add') {
        return cell + matrixB[r][c];
      } else {
        return cell - matrixB[r][c];
      }
    })
  );
};


const InteractiveMatrixGame: React.FC<InteractiveGameProps> = ({ initialMatrixA, initialMatrixB, operation, onBackToExamples }) => {
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
    setResultMatrix(null); // Clear previous result on input change
    setError(null);
    setSuccessMessage(null);
  }, []);

  const handleMatrixBChange = useCallback((newMatrix: Matrix, r: number, c: number) => {
    setMatrixB(newMatrix);
    setRowsB(r);
    setColsB(c);
    setResultMatrix(null);
    setError(null);
    setSuccessMessage(null);
  }, []);

  const calculate = () => {
    setError(null);
    setSuccessMessage(null);
    if (rowsA !== rowsB || colsA !== colsB) {
      setError(`Dimension Mismatch: Matrices must have the same dimensions for ${operation}. Matrix A is ${rowsA}x${colsA}, Matrix B is ${rowsB}x${colsB}.`);
      setResultMatrix(null);
      return;
    }
    if (!matrixA || !matrixB || matrixA.flat().some(isNaN) || matrixB.flat().some(isNaN)) {
        setError("Invalid input: All matrix cells must contain valid numbers.");
        setResultMatrix(null);
        return;
    }

    const result = performOperation(matrixA, matrixB, operation);
    if (result) {
      setResultMatrix(result);
      setSuccessMessage(`Calculation complete! Result of A ${operation === 'add' ? '+' : '-'} B is shown below.`);
    } else {
      // This case should ideally be caught by dimension check above, but as a fallback:
      setError("Could not perform operation. Please check matrix dimensions and values.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 shadow-xl rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
        <h2 className="text-xl font-semibold text-sky-300">
          Interactive Matrix {operation === 'add' ? 'Addition' : 'Subtraction'} Tool
        </h2>
        <button onClick={onBackToExamples} className="btn btn-ghost p-2 text-sm flex items-center">
          <ArrowLeft size={18} className="mr-1" /> Back to Module
        </button>
      </div>

      <main className="flex-grow p-4 overflow-y-auto custom-scrollbar space-y-6">
        <p className="text-slate-300">
          Use the inputs below to define Matrix A and Matrix B. Then, click '{operation === 'add' ? 'Add Matrices' : 'Subtract Matrices'}' to see the result.
          Matrices must have the same dimensions for this operation.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <MatrixInput
            id="matrixA-input"
            title="Matrix A"
            initialRows={initialMatrixA.length}
            initialCols={initialMatrixA[0].length}
            onMatrixChange={handleMatrixAChange}
          />
          <MatrixInput
            id="matrixB-input"
            title="Matrix B"
            initialRows={initialMatrixB.length}
            initialCols={initialMatrixB[0].length}
            onMatrixChange={handleMatrixBChange}
          />
        </div>

        <div className="text-center my-6">
          <button 
            onClick={calculate} 
            className="btn btn-primary text-lg px-8 py-3"
            aria-label={`Calculate Matrix A ${operation === 'add' ? 'plus' : 'minus'} Matrix B`}
          >
            {operation === 'add' ? 'Add A + B' : 'Subtract A - B'}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-md bg-red-700/30 text-red-300 border border-red-500 flex items-start">
            <AlertTriangle size={20} className="mr-2 shrink-0 mt-1" />
            <div>
              <h5 className="font-semibold mb-1">Error</h5>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        {successMessage && !error && (
          <div className="p-4 rounded-md bg-green-700/30 text-green-300 border border-green-500 flex items-start">
            <CheckCircle size={20} className="mr-2 shrink-0 mt-1" />
             <div>
              <h5 className="font-semibold mb-1">Success</h5>
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        {resultMatrix && !error && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-yellow-400 mb-2 text-center">Result</h3>
            <MatrixDisplay
              matrixA={matrixA}
              matrixB={matrixB}
              resultMatrix={resultMatrix}
              operationSymbol={operation === 'add' ? '+' : '-'}
              matrixATitle="Input A"
              matrixBTitle="Input B"
              resultTitle="A ± B"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default InteractiveMatrixGame;
