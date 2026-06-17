

export const gameCardStyle = "p-6 rounded-lg shadow-xl bg-slate-700/70 text-slate-100 border border-slate-600";
export const gameTitleStyle = "text-2xl font-bold text-purple-300 mb-4 text-center";
export const gameInstructionStyle = "text-slate-300 mb-6 text-center";

export const inputStyle = "input-field my-2 p-3 text-lg text-center w-full max-w-sm mx-auto block focus:ring-yellow-400";
export const buttonStyle = "btn btn-primary mt-4 px-6 py-3 text-lg";
export const secondaryButtonStyle = "btn btn-secondary mt-4 px-5 py-2 text-md";
export const smallButtonStyle = "btn btn-ghost mt-2 px-3 py-1 text-sm";


export const feedbackCorrectStyle = "p-3 my-3 rounded-md bg-green-700/50 text-green-200 border border-green-600 transition-all duration-300 ease-in-out text-center";
export const feedbackIncorrectStyle = "p-3 my-3 rounded-md bg-red-700/50 text-red-300 border border-red-600 transition-all duration-300 ease-in-out text-center animate-shake"; // Needs animate-shake in CSS
export const feedbackNeutralStyle = "p-3 my-3 rounded-md bg-sky-700/50 text-sky-200 border border-sky-600 transition-all duration-300 ease-in-out text-center";

export const flashcardFrontStyle = "text-xl md:text-2xl text-yellow-300";
export const flashcardBackStyle = "text-lg md:text-xl text-sky-300";

// Add to index.html <style> or a global CSS file for animations like 'animate-shake'
/*
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
*/