export const GEMINI_MODEL_NAME = "gemini-2.5-flash";

export const MODULE_IDS = {
  ADDITION: 'addition',
  SUBTRACTION: 'subtraction',
  SCALAR_MULTIPLICATION: 'scalarMultiplication',
  MATRIX_MULTIPLICATION: 'matrixMultiplication',
} as const;

export const OPERATION_SYMBOLS: { [key in 'add' | 'subtract' | 'multiply' | 'scalarMultiply']: string } = {
  add: '+',
  subtract: '-',
  multiply: '×', // For matrix multiplication
  scalarMultiply: '×', // For scalar multiplication (often just juxtaposition)
};
