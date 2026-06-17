

import React, { useState } from 'react';
import { AppView, ModuleId, SimulationGameType } from './types';
import Dashboard from './views/Dashboard';
import ModulePage from './views/ModulePage';
import InteractiveMatrixGame from './tools/InteractiveMatrixGame';
import ScalarMultiplicationGame from './tools/ScalarMultiplicationGame';
import MatrixMultiplicationGame from './tools/MatrixMultiplicationGame';
import AiChat from './views/AiChat';
import { ArrowLeft } from 'lucide-react';

import { modules } from './data/modulesContent';
import { SIMULATION_GAME_DATA } from './data/simulationGameData';

// Import the simulation game components
import GridCrafterGame from './games/GridCrafterGame';
import FlashcardsGame from './components/simulation_games/FlashcardsGame';


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>({ type: 'dashboard' });

  // Example matrices for Add/Subtract tool (InteractiveMatrixGame)
  const exampleMatrixA_AddSub = [[1, 2], [3, 4]];
  const exampleMatrixB_AddSub = [[5, 6], [7, 8]];

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
  };

  // This launches the original interactive tools (calculators)
  const handleLaunchInteractiveTool = (moduleId: ModuleId) => {
    setCurrentView({ type: 'game', moduleId });
  };

  // This launches the new simulation mini-games
  const handleLaunchSimulationGame = (moduleId: ModuleId, gameType: SimulationGameType) => {
    setCurrentView({ type: 'simulationGame', moduleId, gameType });
  };
  
  const handleExitInteractiveTool = () => {
    const gameModuleId = currentView.type === 'game' ? currentView.moduleId : modules[0].id; // Fallback
    navigateTo({ type: 'module', moduleId: gameModuleId });
  };

  const handleExitSimulationGame = () => {
    if (currentView.type === 'simulationGame') {
      navigateTo({ type: 'module', moduleId: currentView.moduleId });
    } else {
      navigateTo({type: 'dashboard'}); // Should not happen
    }
  };


  const renderHeader = () => {
    let title = "Matrix Operations Academy";
    let showBackButton = currentView.type !== 'dashboard';
    let backTarget: AppView | (() => void) = { type: 'dashboard' };

    if (currentView.type === 'module') {
      const module = modules.find(m => m.id === currentView.moduleId);
      title = module ? `${module.emoji} ${module.name}` : "Module";
      backTarget = { type: 'dashboard' };
    } else if (currentView.type === 'game') {
        const module = modules.find(m => m.id === currentView.moduleId);
        title = `${module ? `${module.emoji} ${module.name}` : "Interactive"} Tool`;
        backTarget = () => handleExitInteractiveTool();
    } else if (currentView.type === 'simulationGame') {
        const module = modules.find(m => m.id === currentView.moduleId);
        const gameConfig = module?.simulationGames.find(g => g.gameType === currentView.gameType);
        title = gameConfig?.title || "Simulation Game";
        if (module) title = `${module.emoji} ${module.name} - ${title}`;
        backTarget = () => handleExitSimulationGame();
    } else if (currentView.type === 'aiChat') {
        title = "🤖 AI Chat with Professor Axiom";
        backTarget = { type: 'dashboard' };
    }


    return (
      <header className="bg-slate-800 p-4 text-white text-center shadow-lg relative">
        {showBackButton && (
          <button
            onClick={() => typeof backTarget === 'function' ? backTarget() : navigateTo(backTarget)}
            className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-ghost p-2 rounded-full hover:bg-slate-700"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-2xl md:text-3xl font-bold animated-gradient-text shiny-text">{title}</h1>
      </header>
    );
  };

  const renderView = () => {
    switch (currentView.type) {
      case 'dashboard':
        return <Dashboard navigateTo={navigateTo} />;
      case 'module':
        return (
            <ModulePage
                moduleId={currentView.moduleId}
                navigateTo={navigateTo}
                onLaunchInteractiveTool={handleLaunchInteractiveTool} // Kept for potential future use or if some tools are still linked elsewhere
                onLaunchSimulationGame={handleLaunchSimulationGame}
            />
        );
      case 'game': // This is for the original interactive tools
        const moduleTool = modules.find(m => m.id === currentView.moduleId);
        if (!moduleTool) return <p>Error: Tool for module {currentView.moduleId} not found.</p>;

        if (currentView.moduleId === 'addition' || currentView.moduleId === 'subtraction') {
          return (
            <InteractiveMatrixGame
              initialMatrixA={exampleMatrixA_AddSub}
              initialMatrixB={exampleMatrixB_AddSub}
              operation={currentView.moduleId as 'add' | 'subtract'}
              onBackToExamples={handleExitInteractiveTool}
            />
          );
        } else if (currentView.moduleId === 'scalarMultiplication') {
           return <ScalarMultiplicationGame moduleId={currentView.moduleId} onBack={handleExitInteractiveTool} />;
        } else if (currentView.moduleId === 'matrixMultiplication') {
           return <MatrixMultiplicationGame moduleId={currentView.moduleId} onBack={handleExitInteractiveTool} />;
        }
        
        return (
            <div className="p-6 text-center">
                <p className="text-xl text-yellow-400">Interactive tool for {moduleTool?.name} is under construction or not found 🚧</p>
                <button onClick={handleExitInteractiveTool} className="mt-4 btn btn-primary">Back to Module</button>
            </div>
        );
      case 'simulationGame':
        const simModule = modules.find(m => m.id === currentView.moduleId);
        const simGameConfig = simModule?.simulationGames.find(g => g.gameType === currentView.gameType);
        const gameData = SIMULATION_GAME_DATA[currentView.moduleId];


        if (!simModule || !simGameConfig || !gameData) {
             return <p>Error: Simulation game {currentView.gameType} for module {currentView.moduleId} not found.</p>;
        }
        
        const gameProps = {
            moduleId: currentView.moduleId,
            onBackToModule: handleExitSimulationGame,
            gameConfig: simGameConfig,
            gameData: gameData,
        };

        switch (currentView.gameType) {
            case 'gridCrafter':
                return <GridCrafterGame {...gameProps} />;
            case 'flashcards':
                return <FlashcardsGame {...gameProps} />;
            default:
                return <p className="p-6 text-center text-red-400">Error: Unknown simulation game type '{currentView.gameType}'.</p>;
        }

      case 'aiChat':
          return <AiChat />;
      default:
        return <Dashboard navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-[95vh] md:max-h-[90vh] w-full bg-slate-900 shadow-2xl rounded-xl overflow-hidden">
      {renderHeader()}
      <main className="flex-grow overflow-y-auto custom-scrollbar p-3 md:p-6">
        {renderView()}
      </main>
    </div>
  );
};

export default App;