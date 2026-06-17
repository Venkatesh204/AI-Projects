
import { QuizQuestion, ModuleId } from '../types';

export const quizQuestions: QuizQuestion[] = [
  // Addition
  {
    id: 'q-add-1',
    moduleId: 'addition' as ModuleId,
    questionText: 'Given Matrix A = [[1, 0], [2, 3]] and Matrix B = [[4, 5], [6, 7]], what is A + B?',
    options: [
      { id: 'q-add-1-opt1', text: '[[5, 5], [8, 10]]' },
      { id: 'q-add-1-opt2', text: '[[4, 0], [12, 21]]' },
      { id: 'q-add-1-opt3', text: 'Cannot be added' },
    ],
    correctOptionId: 'q-add-1-opt1',
    explanationHTML: "<p>Add corresponding elements: 1+4=5, 0+5=5, 2+6=8, 3+7=10.</p>"
  },
  {
    id: 'q-add-2',
    moduleId: 'addition' as ModuleId,
    questionText: 'What is the primary condition for two matrices to be added or subtracted?',
    options: [
      { id: 'q-add-2-opt1', text: 'They must be square matrices.' },
      { id: 'q-add-2-opt2', text: 'They must have the same number of rows and columns (same dimensions).' },
      { id: 'q-add-2-opt3', text: 'The number of columns in the first must equal the number of rows in the second.' },
    ],
    correctOptionId: 'q-add-2-opt2',
    explanationHTML: "<p>Matrices must have identical dimensions (same number of rows and columns) for addition or subtraction.</p>"
  },
  // Subtraction
  {
    id: 'q-sub-1',
    moduleId: 'subtraction' as ModuleId,
    questionText: 'If Matrix X = [[10, 20], [30, 40]] and Matrix Y = [[3, 5], [7, 2]], what is X - Y?',
    options: [
      { id: 'q-sub-1-opt1', text: '[[7, 15], [23, 38]]' },
      { id: 'q-sub-1-opt2', text: '[[-7, -15], [-23, -38]]' },
      { id: 'q-sub-1-opt3', text: '[[13, 25], [37, 42]]' },
    ],
    correctOptionId: 'q-sub-1-opt1',
    explanationHTML: "<p>Subtract corresponding elements: 10-3=7, 20-5=15, 30-7=23, 40-2=38.</p>"
  },
   {
    id: 'q-sub-2',
    moduleId: 'subtraction' as ModuleId,
    questionText: 'If A - B = C, and C contains negative values, what does this imply about corresponding elements in A and B?',
    options: [
      { id: 'q-sub-2-opt1', text: 'All elements in A were smaller than in B.' },
      { id: 'q-sub-2-opt2', text: 'For elements in C that are negative, the corresponding element in A was smaller than in B.' },
      { id: 'q-sub-2-opt3', text: 'Matrix subtraction cannot result in negative values.' },
    ],
    correctOptionId: 'q-sub-2-opt2',
    explanationHTML: "<p>If A<sub>ij</sub> - B<sub>ij</sub> = C<sub>ij</sub> and C<sub>ij</sub> is negative, then A<sub>ij</sub> must have been less than B<sub>ij</sub>.</p>"
  },
  // Scalar Multiplication
  {
    id: 'q-scalar-1',
    moduleId: 'scalarMultiplication' as ModuleId,
    questionText: 'What is the result of multiplying the scalar 3 by Matrix M = [[2, 0], [-1, 5]]?',
    options: [
      { id: 'q-scalar-1-opt1', text: '[[6, 0], [-3, 15]]' },
      { id: 'q-scalar-1-opt2', text: '[[5, 3], [2, 8]]' },
      { id: 'q-scalar-1-opt3', text: '[[6, 3], [-3, 15]]' },
    ],
    correctOptionId: 'q-scalar-1-opt1',
    explanationHTML: "<p>Multiply each element by the scalar: 3*2=6, 3*0=0, 3*(-1)=-3, 3*5=15.</p>"
  },
  {
    id: 'q-scalar-2',
    moduleId: 'scalarMultiplication' as ModuleId,
    questionText: 'If a matrix is multiplied by a scalar of 0, what is the resulting matrix called?',
    options: [
      { id: 'q-scalar-2-opt1', text: 'Identity Matrix' },
      { id: 'q-scalar-2-opt2', text: 'Zero Matrix (or Null Matrix)' },
      { id: 'q-scalar-2-opt3', text: 'Inverse Matrix' },
    ],
    correctOptionId: 'q-scalar-2-opt2',
    explanationHTML: "<p>Multiplying any matrix by the scalar 0 results in a matrix where all elements are 0, known as the Zero or Null Matrix.</p>"
  },
  // Matrix Multiplication
  {
    id: 'q-matmul-1',
    moduleId: 'matrixMultiplication' as ModuleId,
    questionText: 'If Matrix C is 3x2 and Matrix D is 2x4, what are the dimensions of C × D?',
    options: [
      { id: 'q-matmul-1-opt1', text: '3x4' },
      { id: 'q-matmul-1-opt2', text: '2x2' },
      { id: 'q-matmul-1-opt3', text: 'Cannot be multiplied' },
    ],
    correctOptionId: 'q-matmul-1-opt1',
    explanationHTML: "<p>The inner dimensions (2 and 2) match. The resulting matrix has dimensions 'rows of C' × 'columns of D', which is 3x4.</p>"
  },
  {
    id: 'q-matmul-2',
    moduleId: 'matrixMultiplication' as ModuleId,
    questionText: 'Is matrix multiplication commutative in general (i.e., is A × B always equal to B × A)?',
    options: [
      { id: 'q-matmul-2-opt1', text: 'Yes, always.' },
      { id: 'q-matmul-2-opt2', text: 'No, generally not.' },
      { id: 'q-matmul-2-opt3', text: 'Only if both matrices are square.' },
    ],
    correctOptionId: 'q-matmul-2-opt2',
    explanationHTML: "<p>Matrix multiplication is generally not commutative. A × B is often different from B × A, and sometimes B × A may not even be defined when A × B is.</p>"
  },
  {
    id: 'q-matmul-3',
    moduleId: 'matrixMultiplication' as ModuleId,
    questionText: 'For A = [[1, 2]] (1x2) and B = [[3], [4]] (2x1), what is A × B?',
    questionMatrixA: [[1,2]],
    questionMatrixB: [[3],[4]],
    options: [
      { id: 'q-matmul-3-opt1', text: '[[3, 8]]' },
      { id: 'q-matmul-3-opt2', text: '[[11]] (a 1x1 matrix)' },
      { id: 'q-matmul-3-opt3', text: '[[3], [8]]' },
    ],
    correctOptionId: 'q-matmul-3-opt2',
    explanationHTML: "<p>Result is 1x1. C<sub>11</sub> = (1*3) + (2*4) = 3 + 8 = 11.</p>"
  }
];
