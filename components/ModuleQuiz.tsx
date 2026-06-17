
import React, { useState, useEffect } from 'react';
import { ModuleId, QuizQuestion } from '../types';
import { quizQuestions } from '../data/quizContent';
import MatrixDisplay from './MatrixDisplay';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface ModuleQuizProps {
  moduleId: ModuleId;
}

const ModuleQuiz: React.FC<ModuleQuizProps> = ({ moduleId }) => {
  const [moduleQuestions, setModuleQuestions] = useState<QuizQuestion[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [isCurrentAnswered, setIsCurrentAnswered] = useState(false);

  useEffect(() => {
    const questions = quizQuestions.filter(q => q.moduleId === moduleId);
    setModuleQuestions(questions);
    // Reset component state fully when module changes
    setIsStarted(false);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsCurrentAnswered(false);
  }, [moduleId]);

  const handleStartQuiz = () => {
    setIsStarted(true);
  };

  const handleRetakeQuiz = () => {
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsCurrentAnswered(false);
    setIsStarted(true);
  };
  
  const handleOptionSelect = (questionId: string, optionId: string) => {
    if (isCurrentAnswered) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
    setIsCurrentAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < moduleQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsCurrentAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return moduleQuestions.reduce((score, question) => {
      if (selectedAnswers[question.id] === question.correctOptionId) {
        return score + 1;
      }
      return score;
    }, 0);
  };
  
  if (moduleQuestions.length === 0) {
    return <p className="text-center text-slate-400">No quiz questions available for this module yet.</p>;
  }

  if (!isStarted) {
    return (
      <div className="text-center p-4">
        <p className="text-slate-300 mb-4">Ready to test your knowledge? This quiz has {moduleQuestions.length} questions.</p>
        <button onClick={handleStartQuiz} className="btn btn-secondary">
          Start Knowledge Check
        </button>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / moduleQuestions.length) * 100);
    let feedbackMessage = `You're on the right track! Keep reviewing.`;
    if (percentage === 100) feedbackMessage = `Perfect score! You've mastered this topic! 🚀`;
    else if (percentage >= 75) feedbackMessage = `Great job! You have a solid understanding.`;

    return (
      <div className="space-y-4 text-center">
        <h4 className="text-xl font-semibold text-yellow-400">Quiz Results! 🏆</h4>
        <p className="text-lg text-slate-100">You scored <strong className="text-yellow-300">{score}</strong> out of <strong className="text-yellow-300">{moduleQuestions.length}</strong> ({percentage}%)</p>
        <p className="text-slate-300">{feedbackMessage}</p>
        <div className="mt-4">
          <button onClick={handleRetakeQuiz} className="btn btn-secondary">
            <RotateCcw size={16} className="inline mr-2" />
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }
  
  const currentQuestion = moduleQuestions[currentQuestionIndex];
  const selectedOptionForCurrentQ = selectedAnswers[currentQuestion.id];
  
  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-slate-400">
        Question {currentQuestionIndex + 1} of {moduleQuestions.length}
      </div>
      <p className="text-lg text-slate-100 text-center">{currentQuestion.questionText}</p>

      {currentQuestion.questionMatrixA && (
        <MatrixDisplay 
          matrixA={currentQuestion.questionMatrixA}
          matrixB={currentQuestion.questionMatrixB}
          scalar={currentQuestion.questionScalar}
          operationSymbol={currentQuestion.questionMatrixB ? '?' : undefined} 
          matrixATitle="Matrix A"
          matrixBTitle={currentQuestion.questionMatrixB ? "Matrix B" : undefined}
          hidePlaceholders
        />
      )}

      <div className="space-y-3 mt-4">
        {currentQuestion.options.map(option => {
          const isSelected = selectedOptionForCurrentQ === option.id;
          const isCorrect = option.id === currentQuestion.correctOptionId;
          let buttonClass = 'bg-slate-700 hover:bg-slate-600 text-slate-200';
          if (isCurrentAnswered) {
            if (isSelected && isCorrect) buttonClass = 'bg-green-600 ring-2 ring-green-400 text-white';
            else if (isSelected && !isCorrect) buttonClass = 'bg-red-600 ring-2 ring-red-400 text-white';
            else if (isCorrect) buttonClass = 'bg-green-700/50 ring-1 ring-green-500 text-slate-300';
            else buttonClass = 'bg-slate-700 text-slate-400 opacity-60';
          } else if (isSelected) {
            buttonClass = 'bg-sky-600 ring-2 ring-sky-400 text-white';
          }

          return (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
              disabled={isCurrentAnswered}
              className={`w-full text-left p-3 rounded-md transition-all duration-150 ease-in-out ${buttonClass} flex justify-between items-center`}
            >
              <span>{option.text}</span>
              {isCurrentAnswered && isSelected && isCorrect && <CheckCircle size={20}/>}
              {isCurrentAnswered && isSelected && !isCorrect && <XCircle size={20}/>}
              {isCurrentAnswered && !isSelected && isCorrect && <CheckCircle className="text-green-300" size={20}/>}
            </button>
          );
        })}
      </div>

      {isCurrentAnswered && (
          <div className={`mt-3 p-3 rounded-md text-sm ${selectedOptionForCurrentQ === currentQuestion.correctOptionId ? 'bg-green-800/60 text-green-200' : 'bg-red-800/60 text-red-200'}`}>
              <p className="font-semibold mb-1">
                  {selectedOptionForCurrentQ === currentQuestion.correctOptionId ? 'Correct!' : 'Incorrect.'}
              </p>
              <div className="prose prose-xs prose-invert max-w-none" dangerouslySetInnerHTML={{__html: currentQuestion.explanationHTML}} />
          </div>
      )}

      {isCurrentAnswered && (
        <div className="text-center mt-4">
          <button 
              onClick={handleNextQuestion} 
              className="btn btn-primary"
          >
            {currentQuestionIndex < moduleQuestions.length - 1 ? 'Next Question \u2192' : 'Finish Quiz 🏁'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ModuleQuiz;
