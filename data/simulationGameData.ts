import { ModuleId, SimulationGameData } from '../types';

export const SIMULATION_GAME_DATA: Record<ModuleId, SimulationGameData> = {
  addition: {
    keywords: ["ADD", "SUM", "SAME", "SIZE", "ELEMENTS", "TOTAL"],
    flashcards: [
      { front: "What is the condition for adding two matrices?", back: "They must have the same dimensions (e.g., both 2x3)." },
      { front: "If A = [[1],[2]] and B = [[3],[4]], what is A+B?", back: "[[4],[6]]" },
      { front: "Is matrix addition commutative (A+B = B+A)?", back: "Yes, matrix addition is commutative." },
    ],
  },
  subtraction: {
    keywords: ["SUBTRACT", "DIFFERENCE", "MINUS", "ORDER", "CHANGE"],
    flashcards: [
      { front: "If A - B = C, how is C_ij found?", back: "C_ij = A_ij - B_ij" },
      { front: "Is matrix subtraction commutative (A-B = B-A)?", back: "No, unless A=B or the result is a zero matrix conceptually, but generally A-B != B-A." },
      { front: "A = [[5,5]], B = [[1,2]]. A-B = ?", back: "[[4,3]]" },
    ],
  },
  scalarMultiplication: {
    keywords: ["SCALAR", "MULTIPLY", "SCALE", "DISTRIBUTE", "NUMBER"],
    flashcards: [
      { front: "What does scalar 'k' do to matrix A?", back: "Multiplies every element of A by k." },
      { front: "If k=2 and A=[[1,0],[3,4]], what is kA?", back: "[[2,0],[6,8]]" },
      { front: "Does scalar multiplication change matrix dimensions?", back: "No, dimensions remain the same." },
    ],
  },
  matrixMultiplication: {
    keywords: ["PRODUCT", "COLUMNS", "ROWS", "DOT", "ORDER", "INNER"],
    flashcards: [
      { front: "Condition for A(m×n) × B(p×q) to be defined?", back: "n must equal p (inner dimensions)." },
      { front: "If A is 2x3 and B is 3x4, what are dimensions of A × B?", back: "2x4 (outer dimensions)." },
      { front: "Is A×B always equal to B×A?", back: "No, matrix multiplication is not generally commutative." },
    ],
  },
};