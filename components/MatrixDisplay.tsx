

import React from 'react';
import { Matrix, DisplayMatrix, MatrixPosition, DisplayMatrixElement, MatrixValue } from '../types';

interface MatrixDisplayProps {
  matrixA: Matrix | DisplayMatrix | null; // Can display result matrices too
  matrixB?: Matrix | DisplayMatrix | null; // Optional for scalar mult or single matrix display
  resultMatrix?: DisplayMatrix | Matrix | null; // Can display final numeric matrix
  operationSymbol?: string | null; // e.g., '+', '-', 'x'
  currentFocus?: MatrixPosition | null;
  highlightCells?: { matrix: 'A' | 'B' | 'Result', positions: MatrixPosition[] }[]; // More granular highlight
  matrixATitle?: string;
  matrixBTitle?: string;
  resultTitle?: string;
  hidePlaceholders?: boolean; // If true, don't show '_', '?'
  scalar?: number; // New prop for displaying a scalar
}

const MatrixDisplay: React.FC<MatrixDisplayProps> = ({
  matrixA,
  matrixB,
  resultMatrix,
  operationSymbol,
  currentFocus,
  highlightCells = [],
  matrixATitle = "Matrix A",
  matrixBTitle = "Matrix B",
  resultTitle = "Result",
  hidePlaceholders = false,
  scalar,
}) => {
  if (!matrixA) {
    return <pre className="text-sm bg-slate-700 p-4 rounded-md text-yellow-300">Matrix A not available.</pre>;
  }

  const getCellClass = (matrixKey: 'A' | 'B' | 'Result', r: number, c: number): string => {
    let classes = "px-2 py-1 text-center min-w-[40px] md:min-w-[50px]";
    const isFocused = matrixKey === 'Result' && currentFocus?.row === r && currentFocus?.col === c;
    
    const isHighlighted = highlightCells.some(h => 
      h.matrix === matrixKey && h.positions.some(p => p.row === r && p.col === c)
    );

    if (isFocused) {
      classes += " ring-2 ring-sky-400 rounded bg-sky-700/50";
    } else if (isHighlighted) {
      classes += " bg-yellow-500/30 rounded";
    }
    return classes;
  };

  const formatCellValue = (cell: MatrixValue | DisplayMatrixElement): string => {
    if (hidePlaceholders && (cell === '_' || cell === '?')) return '';
    if (typeof cell === 'string' && cell.startsWith('✅')) {
      return `✅${cell.substring(1)}`;
    }
    return String(cell);
  };
  
  const renderMatrix = (matrix: Matrix | DisplayMatrix | null, title: string, matrixKey: 'A' | 'B' | 'Result') => {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
      return <div className="text-slate-400">{title} is empty.</div>;
    }
    return (
      <div className="flex flex-col items-center">
        <p className="text-sm font-medium text-sky-300 mb-1">{title}</p>
        <table className="border-collapse">
          <tbody>
            {matrix.map((row, r) => (
              <tr key={r}>
                <td className={`border-l-2 ${r === 0 ? 'border-t-2' : ''} ${r === matrix.length -1 ? 'border-b-2' : ''} border-slate-500`}></td> {/* Left bracket part */}
                {row.map((cell, c) => (
                  <td key={c} className={`${getCellClass(matrixKey, r, c)} ${r === 0 ? 'border-t-2' : ''} ${r === matrix.length -1 ? 'border-b-2' : ''} ${c === 0 ? '' : 'border-l'} border-slate-600`}>
                    {formatCellValue(cell)}
                  </td>
                ))}
                <td className={`border-r-2 ${r === 0 ? 'border-t-2' : ''} ${r === matrix.length -1 ? 'border-b-2' : ''} border-slate-500`}></td> {/* Right bracket part */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-slate-700/50 p-3 md:p-4 rounded-lg shadow-inner my-2 flex flex-col md:flex-row items-center justify-around space-y-4 md:space-y-0 md:space-x-4 overflow-x-auto custom-scrollbar">
      {scalar !== undefined && (
         <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-sky-300 mb-1">Scalar</p>
            <div className="text-2xl font-bold p-4">{scalar}</div>
        </div>
      )}
      {scalar !== undefined && <div className="text-2xl font-bold text-yellow-400 mx-1 md:mx-2">×</div>}
      
      {renderMatrix(matrixA, matrixATitle, 'A')}
      
      {operationSymbol && matrixB && (
        <div className="text-2xl font-bold text-yellow-400 mx-1 md:mx-2">{operationSymbol}</div>
      )}
      {matrixB && renderMatrix(matrixB, matrixBTitle, 'B')}
      
      {(operationSymbol || scalar !== undefined) && resultMatrix && (
         <div className="text-2xl font-bold text-yellow-400 mx-1 md:mx-2">=</div>
      )}
      {resultMatrix && renderMatrix(resultMatrix, resultTitle, 'Result')}
    </div>
  );
};

export default MatrixDisplay;