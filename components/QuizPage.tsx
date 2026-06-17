
import React, { useState } from 'react';
import { AppView, QuizQuestion } from '../types';
import { quizQuestions } from '../data/quizContent';
import ContentCard from './ContentCard';
import MatrixDisplay from './MatrixDisplay'; // For questions with matrices
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizPageProps {
  navigateTo: (view: AppView) => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ navigateTo }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Store selected option ID for each question ID
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  // Store if the current question has been answered to show immediate feedback
  const [isCurrentAnswered, setIsCurrentAnswered] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleOptionSelect = (questionId: string, optionId: string) => {
    if (isCurrentAnswered) return; // Prevent changing answer after feedback

    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
    setIsCurrentAnswered(true); // Mark as answered to show feedback
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsCurrentAnswered(false); // Reset for the new question
    } else {
      setShowResults(true);
    }
  };
  
  const handlePreviousQuestion = () => {
    // Generally, in quizzes, going back after answering is disabled.
    // If allowed, ensure state like isCurrentAnswered is handled.
    // For now, this button is less prominent / might be removed in a strict quiz flow.
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Check if previous question was answered to restore its feedback state
      setIsCurrentAnswered(!!selectedAnswers[quizQuestions[currentQuestionIndex - 1].id]);
    }
  };

  const calculateScore = () => {
    return quizQuestions.reduce((score, question) => {
      if (selectedAnswers[question.id] === question.correctOptionId) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="space-y-6 text-center">
        <ContentCard title="Quiz Results! 🏆">
          <p className="text-2xl text-slate-100">You scored <strong className="text-yellow-400">{score}</strong> out of <strong className="text-yellow-400">{quizQuestions.length}</strong>!</p>
          <div className="mt-4 space-y-3 text-left">
            {quizQuestions.map(q => {
              const selectedOptId = selectedAnswers[q.id];
              const selectedOpt = q.options.find(opt => opt.id === selectedOptId);
              const correctOpt = q.options.find(opt => opt.id === q.correctOptionId);
              const isUserCorrect = selectedOptId === q.correctOptionId;
              return (
                <div key={q.id} className={`p-3 rounded-md ${isUserCorrect ? 'bg-green-800/60 border border-green-600' : 'bg-red-800/60 border border-red-600'}`}>
                  <p className="font-semibold text-slate-200 mb-1">{q.questionText}</p>
                  <p className={`text-sm ${isUserCorrect ? 'text-green-300' : 'text-red-300'}`}>
                    Your answer: {selectedOpt?.text || <span className="italic text-slate-400">Not answered</span>}
                    {isUserCorrect ? <CheckCircle className="inline ml-2 text-green-400" size={16}/> : <XCircle className="inline ml-2 text-red-400" size={16}/>}
                  </p>
                  {!isUserCorrect && <p className="text-sm text-green-300">Correct answer: {correctOpt?.text}</p>}
                   <div className="mt-2 text-xs prose prose-sm prose-invert max-w-none text-slate-400" dangerouslySetInnerHTML={{ __html: q.explanationHTML }} />
                </div>
              );
            })}
          </div>
        </ContentCard>
        <button onClick={() => { setShowResults(false); setCurrentQuestionIndex(0); setSelectedAnswers({}); setIsCurrentAnswered(false);}} className="btn btn-secondary mr-2">
            Retake Quiz
        </button>
        <button onClick={() => navigateTo({ type: 'dashboard' })} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="p-6 text-center text-red-400">No questions available or quiz ended.</div>;
  }
  
  const selectedOptionForCurrentQ = selectedAnswers[currentQuestion.id];

  return (
    <div className="space-y-6">
      <ContentCard title={`Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`}>
        <p className="text-lg text-slate-100 mb-4">{currentQuestion.questionText}</p>
        
        {currentQuestion.questionMatrixA && (
          <MatrixDisplay 
            matrixA={currentQuestion.questionMatrixA}
            matrixB={currentQuestion.questionMatrixB}
            // Operation symbol might not always be relevant for a question display
            operationSymbol={currentQuestion.questionMatrixB ? '?' : undefined} 
            matrixATitle="Matrix A"
            matrixBTitle={currentQuestion.questionMatrixB ? "Matrix B" : undefined}
            hidePlaceholders
          />
        )}
        {currentQuestion.questionScalar !== undefined && ( // Check for scalar presence
           <p className="text-lg text-slate-100 my-2">Scalar Value: <strong className="text-yellow-400">{currentQuestion.questionScalar}</strong></p>
        )}


        <div className="space-y-3 mt-4">
          {currentQuestion.options.map(option => {
            const isSelected = selectedOptionForCurrentQ === option.id;
            const isCorrect = option.id === currentQuestion.correctOptionId;
            let buttonClass = 'bg-slate-700 hover:bg-slate-600 text-slate-200'; // Default
            if (isCurrentAnswered) {
              if (isSelected && isCorrect) buttonClass = 'bg-green-600 ring-2 ring-green-400 text-white';
              else if (isSelected && !isCorrect) buttonClass = 'bg-red-600 ring-2 ring-red-400 text-white';
              else if (isCorrect) buttonClass = 'bg-green-700/50 ring-1 ring-green-500 text-slate-300'; // Show correct if not selected
              else buttonClass = 'bg-slate-700 text-slate-400 opacity-70'; // Dim unselected, incorrect options
            } else if (isSelected) {
                 buttonClass = 'bg-sky-600 ring-2 ring-sky-400 text-white'; // Highlight selected before submitting/feedback
            }

            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                disabled={isCurrentAnswered} // Disable after an answer is processed for current question
                className={`w-full text-left p-3 rounded-md transition-all duration-150 ease-in-out ${buttonClass}`}
              >
                {option.text}
                {isCurrentAnswered && isSelected && isCorrect && <CheckCircle className="inline ml-2 float-right text-white" size={20}/>}
                {isCurrentAnswered && isSelected && !isCorrect && <XCircle className="inline ml-2 float-right text-white" size={20}/>}
                {isCurrentAnswered && !isSelected && isCorrect && <CheckCircle className="inline ml-2 float-right text-green-300" size={20}/>}
              </button>
            );
          })}
        </div>
        {isCurrentAnswered && (
            <div className={`mt-4 p-3 rounded-md text-sm ${selectedOptionForCurrentQ === currentQuestion.correctOptionId ? 'bg-green-800/70 text-green-200' : 'bg-red-800/70 text-red-200'}`}>
                <p className="font-semibold mb-1">
                    {selectedOptionForCurrentQ === currentQuestion.correctOptionId ? 'Correct!' : 'Incorrect.'}
                </p>
                <div className="prose prose-xs prose-invert max-w-none" dangerouslySetInnerHTML={{__html: currentQuestion.explanationHTML}} />
            </div>
        )}
      </ContentCard>
      <div className="flex justify-between items-center mt-6">
        <button 
            onClick={handlePreviousQuestion} 
            disabled={currentQuestionIndex === 0 || showResults}
            className="btn btn-ghost disabled:opacity-30"
        >
            &larr; Previous
        </button>
        <p className="text-sm text-slate-400">
            Question {currentQuestionIndex + 1} / {quizQuestions.length}
        </p>
        <button 
            onClick={handleNextQuestion} 
            // Enable Next only if current question is answered, or if it's already showing results (to go to summary)
            disabled={!isCurrentAnswered && !showResults}
            className="btn btn-primary disabled:opacity-50"
        >
          {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question \u2192' : 'Finish Quiz 🏁'}
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
