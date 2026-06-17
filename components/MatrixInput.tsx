
import React, { useState, useEffect, useCallback } from 'react';
import { Matrix, MatrixValue, MatrixInputProps } from '../types';

const MatrixInput: React.FC<MatrixInputProps> = ({ id, initialRows = 2, initialCols = 2, onMatrixChange, title }) => {
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);
  const [grid, setGrid] = useState<Matrix>(
    Array(initialRows).fill(null).map(() => Array(initialCols).fill(0))
  );
  const [inputError, setInputError] = useState<string | null>(null);

  // Debounce matrix change callback
  const debouncedOnMatrixChange = useCallback(
    debounce((matrix: Matrix, r: number, c: number) => {
      onMatrixChange(matrix, r, c);
    }, 300),
    [onMatrixChange] 
  );
  
  // Initialize or resize grid when rows/cols change
  useEffect(() => {
    setGrid(currentGrid => {
      const newGrid: Matrix = Array(rows).fill(null).map((_, r) =>
        Array(cols).fill(null).map((__, c) => {
          return (currentGrid[r] && typeof currentGrid[r][c] === 'number') ? currentGrid[r][c] : 0;
        })
      );
      debouncedOnMatrixChange(newGrid, rows, cols);
      return newGrid;
    });
  }, [rows, cols, debouncedOnMatrixChange]);

  const handleDimensionChange = (value: string, type: 'rows' | 'cols') => {
    const num = parseInt(value, 10);
    if (num > 0 && num <= 10) { // Max 10x10 for practical UI
      if (type === 'rows') setRows(num);
      else setCols(num);
      setInputError(null);
    } else {
      setInputError("Dimensions must be between 1 and 10.");
    }
  };

  const handleCellChange = (r: number, c: number, value: string) => {
    const num = parseFloat(value);
    const newGrid = grid.map(row => [...row]); // Deep copy
    if (!isNaN(num)) {
      newGrid[r][c] = num;
      setInputError(null);
    } else if (value.trim() === '' || value === '-') {
       newGrid[r][c] = 0; // Or handle as empty/placeholder if needed. For now, treat as 0 for calculation.
       // Potentially show a temporary validation message for empty string if strictness needed
    } else {
      setInputError(`Invalid number in cell (${r+1},${c+1}). Please enter numeric values.`);
      // Optionally revert to old value or keep it empty until valid
      // For now, allow text to show error, but calculation should use valid numbers.
      // This part is tricky: if we keep non-numeric, `grid` type needs to be `(number | string)[][]`
      // For simplicity, we'll try to parse, if NaN, it won't update the numeric grid for calculation.
      // The current setup immediately updates grid for onMatrixChange, so it's better to ensure only numbers go in.
      // Let's coerce to 0 if invalid for calculation, but show error
       newGrid[r][c] = 0; // Coerce for internal state if needed, or prevent update
    }
    setGrid(newGrid);
    debouncedOnMatrixChange(newGrid, rows, cols);
  };

  return (
    <div className="p-4 card bg-slate-700/60 my-4">
      {title && <h4 className="text-lg font-semibold text-sky-300 mb-3">{title}</h4>}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
        <div>
          <label htmlFor={`${id}-rows`} className="block text-sm font-medium text-slate-300 mb-1">Rows:</label>
          <input
            type="number"
            id={`${id}-rows`}
            value={rows}
            onChange={(e) => handleDimensionChange(e.target.value, 'rows')}
            min="1" max="10"
            className="input-field w-20 text-center"
            aria-label="Number of rows"
          />
        </div>
        <div>
          <label htmlFor={`${id}-cols`} className="block text-sm font-medium text-slate-300 mb-1">Columns:</label>
          <input
            type="number"
            id={`${id}-cols`}
            value={cols}
            onChange={(e) => handleDimensionChange(e.target.value, 'cols')}
            min="1" max="10"
            className="input-field w-20 text-center"
            aria-label="Number of columns"
          />
        </div>
      </div>

      {inputError && <p className="text-sm text-red-400 mb-2 animate-pulse">{inputError}</p>}

      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {grid.map((rowArr, r) =>
          rowArr.map((cell, c) => (
            <input
              key={`${id}-cell-${r}-${c}`}
              type="text" // Use text to allow '-', then parse to float
              value={grid[r][c]} // Display the stored number
              onChange={(e) => handleCellChange(r, c, e.target.value)}
              className="input-field text-center p-2 h-10 w-full min-w-[50px] focus:ring-yellow-400 bg-slate-100 text-slate-900 font-medium border-slate-400 placeholder-slate-500 focus:border-yellow-400"
              aria-label={`Matrix cell row ${r + 1} column ${c + 1}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export default MatrixInput;
