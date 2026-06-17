
import { GoogleGenAI, GenerateContentResponse }  from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';
import { Matrix, Operation, MatrixPosition, DisplayMatrix, MatrixValue } from "../types";

const API_KEY = process.env.API_KEY;

// Fallback to a very generic mock if API_KEY is missing
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const generateText = async (prompt: string): Promise<string> => {
  if (!ai) {
    // Generic mock responses if API key is not available
    console.warn("API_KEY not set. Using generic mock responses for Gemini calls.");
    if (prompt.includes("enthusiastic greeting")) return "Hi there! 👋 Let's get this matrix problem solved! 🔧\n\n```\nOkay, let's solve this matrix problem!\nMatrix A + Matrix B = Result\n```";
    if (prompt.includes("dimension mismatch")) return "Oh dear! 🤔 It looks like our matrices aren't quite the same size. For this operation, they need to match up perfectly! Double-check their dimensions and let's try again! 👍";
    if (prompt.includes("What is")) return "Alright! Let's tackle this part! What do you get for the highlighted numbers? You got this! 🚀";
    if (prompt.includes("successfully completed")) return "Woohoo! 🎉 You did it! You've successfully navigated the matrix! Amazing work! ✨\n\n```\nAnd we're done! You solved it! ✨\n```\nYou've mastered this matrix operation! 👍";
    return "This is a mock response as the Gemini API key is not configured. Full AI features are disabled.";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    let errorMessage = "Oops! ⚙️ I had a little trouble thinking. Please try again or check the console for details.";
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            errorMessage = "Error: The Gemini API key is not valid. Please check your configuration. 🔑 If you're running this locally, ensure the API_KEY environment variable is set.";
        } else {
            const googleError = error as any;
            if (googleError.message && googleError.message.includes("FETCH_ERROR")) {
                 errorMessage = "Oops! ⚙️ I couldn't connect to the Gemini service. Please check your internet connection and make sure the API endpoint is reachable. If the problem persists, the service might be temporarily down.";
            } else if (googleError.message && googleError.message.toLowerCase().includes("quota")) {
                errorMessage = "Oh no! Quota limit reached. 🚦 It seems we've hit our usage limit for the Gemini API. Please try again later or check your API quota.";
            }
        }
    }
    // Add a system-error message to chat in the game? This service doesn't directly interact with chat state.
    // The component calling this service should handle displaying the error.
    return errorMessage;
  }
};

const formatMatrixForPromptText = (matrix: Matrix | DisplayMatrix | null, name: string): string => {
  if (!matrix || matrix.length === 0 || matrix[0].length === 0) return `${name} is empty.`;
  // Ensure '?' or '_' are handled if they appear in DisplayMatrix during prompt construction
  return `${name} (${matrix.length}x${matrix[0].length}):\n${matrix.map(row => `| ${row.map(cell => String(cell === '_' || cell === '?' ? '?' : cell).padEnd(3)).join(' ')} |`).join('\n')}`;
};

export const getInitialGreetingAndSetup = async (
  matrixA: Matrix,
  matrixB: Matrix,
  operation: 'add' | 'subtract', // Specific to this game
  resultMatrixShell: DisplayMatrix // Pass the shell for correct '?' display
): Promise<string> => {
  const opWord = operation === 'add' ? 'add' : 'subtract';
  const opSymbol = operation === 'add' ? '+' : '-';

  const prompt = `
You are 'The Visual Matrix Mechanic' 🔧. Your personality is enthusiastic, encouraging, and highly visual. You use emojis liberally (like 👍, 🎉, 🤔, 🎯, 👇).

A student wants to ${opWord} Matrix A and Matrix B.
${formatMatrixForPromptText(matrixA, 'Matrix A')}
${formatMatrixForPromptText(matrixB, 'Matrix B')}

Generate an enthusiastic greeting. Then, clearly present the problem statement inside a markdown code block.
The code block should show Matrix A, the operation symbol (${opSymbol}), Matrix B, and the initial Result matrix filled with '?' placeholders, matching the dimensions of Matrix A.
The Result matrix to display in the code block is:
${formatMatrixForPromptText(resultMatrixShell, 'Result (initial)')}

Example of the desired code block format (use the actual matrix data provided above):
\`\`\`
Okay, so we want to ${opWord} Matrix A and Matrix B!

Matrix A      Matrix B      Result
| 8  3 |   ${opSymbol}   | 5  4 |   =   | ?  ? |
| 2  1 |       | 9  6 |       | ?  ? |
\`\`\`
Keep the intro short and sweet, then provide the code block.
`;
  return generateText(prompt);
};

// getDimensionMismatchError might not be needed if InteractiveMatrixGame always receives valid matrices.
// If MatrixInput is reintroduced for the game, then it would be useful. For now, it's less critical.

export const getQuestionForElement = async (
  valA: MatrixValue,
  valB: MatrixValue,
  operation: 'add' | 'subtract',
  currentFocus: MatrixPosition,
  isFirstStep: boolean
): Promise<string> => {
  const opWord = operation === 'add' ? 'add' : 'subtract';
  const opSymbol = operation === 'add' ? '+' : '-';

  let introMessage = isFirstStep
    ? `Let's find the very first number! 🎯 We'll look at the top-left corner (row ${currentFocus.row + 1}, col ${currentFocus.col + 1}).`
    : `Fantastic! On to the next one! We're now looking at row ${currentFocus.row + 1}, column ${currentFocus.col + 1}.`;
  
  if (currentFocus.col === 0 && currentFocus.row > 0 && !isFirstStep) {
      introMessage = `Great work on that row! 👍 Now starting row ${currentFocus.row + 1}, column ${currentFocus.col + 1}.`;
  }

  const prompt = `
You are 'The Visual Matrix Mechanic' 🔧.
${introMessage}
The student needs to calculate the element at row ${currentFocus.row + 1}, column ${currentFocus.col + 1}.
The value from Matrix A is ${valA}.
The value from Matrix B is ${valB}.
The operation is ${opWord} (${opSymbol}).

Your task: Politely and enthusiastically ask the student: "What is ${valA} ${opSymbol} ${valB}?"
Encourage them. Use your fun, emoji-filled persona! Example: "You've got this! 🚀 What's ${valA} ${opSymbol} ${valB}?"
The app shows the visual matrix diagram. You provide the textual question and encouragement.
`;
  return generateText(prompt);
};

export const getCompletionMessage = async (
  matrixA: Matrix,
  matrixB: Matrix,
  finalResultMatrix: Matrix, // Contains only numbers now
  operation: 'add' | 'subtract'
): Promise<string> => {
  const opSymbol = operation === 'add' ? '+' : '-';
  const opWord = operation === 'add' ? 'addition' : 'subtraction';

  const prompt = `
You are 'The Visual Matrix Mechanic' 🔧.
The student has successfully completed the matrix ${opWord}! Amazing work! ✨
Here is the final result. Present it clearly in a markdown code block.
${formatMatrixForPromptText(matrixA, 'Matrix A')}
${formatMatrixForPromptText(matrixB, 'Matrix B')}
${formatMatrixForPromptText(finalResultMatrix, 'Final Result')}

Make sure your code block for the final reveal looks like this (using actual data):
\`\`\`
And we're done! You solved it! ✨ Here is the final result:

Matrix A      Matrix B      Result
| 8  3 |   ${opSymbol}   | 5  4 |   =   | 13  7 |
| 2  1 |       | 9  6 |       | 11  7 |
\`\`\`
Congratulate them enthusiastically! Tell them they've mastered matrix ${opWord}! 👍
`;
  return generateText(prompt);
};