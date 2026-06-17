

import React from 'react';
import {
  BookOpen, Puzzle, HelpCircle, Sigma, DivideSquare, ListPlus, ListMinus,
  Edit3, Calculator, Layers, Shuffle, PlayCircle, AlertTriangle, CheckCircle, XCircle, ArrowLeft, RotateCcw, Lightbulb,
  Bot, User, SendHorizonal, Sparkles, LayoutGrid
} from 'lucide-react';

export const iconMap: { [key: string]: React.ElementType } = {
  BookOpen,
  Puzzle,
  HelpCircle,
  Sigma,
  DivideSquare,
  ListPlus,
  ListMinus,
  Edit3,         // For FillInTheBlanks / Concept Cloze
  Calculator,    // For NumberChallenge / Quick Sums
  Layers,        // For Flashcards
  Shuffle,       // For WordPuzzle
  PlayCircle,    // For launching interactive tools/games
  AlertTriangle, // For errors
  CheckCircle,   // For success/correct
  XCircle,       // For incorrect
  ArrowLeft,     // For back button
  RotateCcw,     // For retry/reset
  Lightbulb,     // For hints or explanations
  Bot,           // For AI assistant
  User,          // For user icon
  SendHorizonal, // For send button
  Sparkles,      // For AI-related features
  LayoutGrid,    // For GridCrafter game
  // Add any other icons used across the app here
};