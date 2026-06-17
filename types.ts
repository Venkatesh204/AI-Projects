
export type MatrixValue = number;
export type Matrix = MatrixValue[][];

// For display in interactive tools/results
export type DisplayMatrixElement = MatrixValue | string;
export type DisplayMatrix = DisplayMatrixElement[][];


export type Operation = 'add' | 'subtract' | 'multiply' | 'scalarMultiply';
export type ModuleId = 'addition' | 'subtraction' | 'matrixMultiplication' | 'scalarMultiplication';

export interface MatrixPosition {
  row: number;
  col: number;
}

// Type for the AI Chat module messages
export interface AiChatMessage {
  role: 'user' | 'model' | 'system-error';
  content: string;
  isStreaming?: boolean;
}


export interface GameComponentProps {
  moduleId: ModuleId;
  onGameComplete?: () => void; // Optional callback
}

export interface Flashcard {
  front: string;
  back: string;
}

// New types for other simulation games
export interface FillInTheBlank {
  sentenceParts: [string, string];
  blankAnswer: string;
}

export interface NumberChallenge {
  textPrompt: string;
  expectedAnswer: number;
  matrixA?: Matrix;
  matrixB?: Matrix;
  scalar?: number;
  operation?: 'add' | 'subtract' | 'multiply';
}

export interface SimulationGameData {
  keywords: string[];
  flashcards: Flashcard[];
  fillIns?: FillInTheBlank[];
  numberChallenges?: NumberChallenge[];
}


// Simulation Games
export type SimulationGameType = 'gridCrafter' | 'flashcards';

export interface SimulationGameConfig {
  gameType: SimulationGameType;
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface GridCrafterScenario {
  title: string;
  description: string;
  worldMatrix: Matrix;
  operatorMatrix?: Matrix;
  operatorScalar?: number;
  targetMatrix: Matrix;
  // Function to map a cell's numeric value to a CSS class for visualization
  visualMap: (value: number) => { className: string; icon?: string };
}


export interface ModuleContent {
  id: ModuleId;
  name: string;
  tagline: string;
  icon: string;
  emoji: string;
  conceptHTML: string; // New: Explanation of the concept
  objectiveHTML: string; // New: Learning objectives
  simulationGames: SimulationGameConfig[];
  gridCrafterScenario?: GridCrafterScenario;
}

// Type for an interactive, step-by-step real-world example
export interface RealLifeExample {
  id: string;
  title: string;
  descriptionHTML: string;
  operation: Operation;
  matrixA?: Matrix;
  matrixB?: Matrix;
  scalar?: number;
  resultMatrix: Matrix;
}

export type AppView =
  | { type: 'dashboard' }
  | { type: 'module'; moduleId: ModuleId }
  | { type: 'game'; moduleId: ModuleId } // 'game' now refers to the original interactive tools
  | { type: 'simulationGame'; moduleId: ModuleId; gameType: SimulationGameType }
  | { type: 'aiChat' };

// Props for InteractiveMatrixGame (original interactive tool)
export interface InteractiveGameProps {
  initialMatrixA: Matrix;
  initialMatrixB: Matrix;
  operation: 'add' | 'subtract';
  onBackToExamples: () => void;
}

// Props for the new MatrixInput component
export interface MatrixInputProps {
  id: string; // Unique ID for accessibility
  initialRows?: number;
  initialCols?: number;
  onMatrixChange: (matrix: Matrix, rows: number, cols: number) => void;
  title?: string; // Optional title for the input section
}

// Props for Simulation Game components
export interface SimulationGameComponentProps {
  moduleId: ModuleId;
  onBackToModule: () => void;
  gameConfig: SimulationGameConfig;
  gameData?: SimulationGameData;
}

// Quiz Types
export interface QuizQuestionOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  moduleId: ModuleId;
  questionText: string;
  options: QuizQuestionOption[];
  correctOptionId: string;
  explanationHTML: string;
  questionMatrixA?: Matrix;
  questionMatrixB?: Matrix;
  questionScalar?: number;
}
