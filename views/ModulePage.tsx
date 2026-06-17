

import React from 'react';
import { ModuleId, AppView, SimulationGameType } from '../types';
import { modules } from '../data/modulesContent';
import ContentCard from '../components/ContentCard';
import { iconMap } from '../utils/iconMap';
import { Puzzle, PlayCircle } from 'lucide-react'; // Puzzle as a fallback icon
import ModuleQuiz from '../components/ModuleQuiz';

interface ModulePageProps {
  moduleId: ModuleId;
  navigateTo: (view: AppView) => void;
  onLaunchInteractiveTool: (moduleId: ModuleId) => void;
  onLaunchSimulationGame: (moduleId: ModuleId, gameType: SimulationGameType) => void;
}

const ModulePage: React.FC<ModulePageProps> = ({ moduleId, navigateTo, onLaunchInteractiveTool, onLaunchSimulationGame }) => {
  const module = modules.find(m => m.id === moduleId);

  if (!module) {
    return <div className="p-6 text-center text-red-400">Module not found!</div>;
  }

  return (
    <div className="space-y-6">
      {/* Concept and Objective Section */}
      <ContentCard title="🎓 Concept & Learning Objectives" className="bg-slate-800/70">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-sky-300 mb-2">Concept</h4>
            <div
              className="prose prose-sm prose-invert max-w-none text-slate-300"
              dangerouslySetInnerHTML={{ __html: module.conceptHTML }}
            />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-sky-300 mb-2">Objectives</h4>
            <div
              className="prose prose-sm prose-invert max-w-none text-slate-300"
              dangerouslySetInnerHTML={{ __html: module.objectiveHTML }}
            />
          </div>
        </div>
      </ContentCard>

      {/* New Simulation Games Section */}
      <ContentCard title="🎲 Simulation Games" className="bg-slate-800/70">
        <p className="text-slate-300 mb-4">Engage with {module.name} concepts through fun and interactive mini-games!</p>
        {module.simulationGames && module.simulationGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {module.simulationGames.map(gameConfig => {
              const IconComponent = iconMap[gameConfig.icon] || Puzzle;
              return (
                <button
                  key={gameConfig.gameType}
                  onClick={() => onLaunchSimulationGame(module.id, gameConfig.gameType)}
                  className="card bg-slate-700/80 hover:bg-slate-600/80 p-4 text-left focus:ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-900 flex flex-col items-center justify-center text-center transition-all duration-200 hover:shadow-purple-500/30 transform hover:-translate-y-1"
                  aria-label={`Play ${gameConfig.title}`}
                >
                  <IconComponent size={36} className="text-purple-400 mb-3" />
                  <h4 className="text-lg font-semibold text-purple-300 mb-1 shiny-text">{gameConfig.title}</h4>
                  <p className="text-sm text-slate-400">{gameConfig.description}</p>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-400 text-center">No simulation games available for this module yet. Stay tuned!</p>
        )}
      </ContentCard>

      {/* Interactive Tool Section */}
      <ContentCard title="🛠️ Interactive Tool" className="bg-slate-800/70">
        <p className="text-slate-300 mb-4">
          Use our hands-on calculator to experiment with {module.name}. Change the numbers and see the results instantly!
        </p>
        <div className="text-center">
          <button
            onClick={() => onLaunchInteractiveTool(module.id)}
            className="btn btn-secondary text-base inline-flex items-center"
            aria-label={`Launch interactive tool for ${module.name}`}
          >
            <PlayCircle size={20} className="mr-2" />
            Launch {module.name} Tool
          </button>
        </div>
      </ContentCard>
      
      {/* Knowledge Check Section */}
      <ContentCard title="🧠 Knowledge Check" className="bg-slate-800/70">
        <ModuleQuiz moduleId={module.id} />
      </ContentCard>
      
    </div>
  );
};

export default ModulePage;