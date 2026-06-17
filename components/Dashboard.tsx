
import React from 'react';
import { AppView, ModuleId } from '../types';
import { modules } from '../data/modulesContent';
import { iconMap } from '../utils/iconMap'; // Import shared iconMap
import { BookOpen } from 'lucide-react';
import { AdditionIcon, SubtractionIcon, ScalarMultiplicationIcon, MatrixMultiplicationIcon } from './ModuleIcons';

interface DashboardProps {
  navigateTo: (view: AppView) => void;
}

const moduleIcons: { [key in ModuleId]?: React.ElementType } = {
    addition: AdditionIcon,
    subtraction: SubtractionIcon,
    scalarMultiplication: ScalarMultiplicationIcon,
    matrixMultiplication: MatrixMultiplicationIcon,
};


const Dashboard: React.FC<DashboardProps> = ({ navigateTo }) => {
  const AiIcon = iconMap['Sparkles'];
  return (
    <div className="space-y-8">
      <div className="text-center p-4">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100">Welcome to the Matrix Academy!</h2>
        <p className="text-slate-300 mt-2 text-lg">Select a module to learn or test your knowledge.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const IconComponent = moduleIcons[module.id] || iconMap[module.icon] || BookOpen;
          return (
            <button
              key={module.id}
              onClick={() => navigateTo({ type: 'module', moduleId: module.id })}
              className="card text-left hover:bg-slate-700 hover:shadow-sky-500/30 focus:ring-2 ring-sky-500 ring-offset-2 ring-offset-slate-900 flex flex-col justify-between"
              aria-label={`Learn about ${module.name}`}
            >
              <div>
                  <div className="flex items-start mb-3">
                    <IconComponent className="w-16 h-16 mr-4 flex-shrink-0" />
                    <div>
                        <h3 className="text-2xl font-semibold text-sky-300">{module.name}</h3>
                        <p className="text-slate-300 mt-1 text-sm">{module.tagline}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 group-hover:text-slate-200">
                    Dive into real-world examples and interactive exercises.
                  </p>
              </div>
               <span className="mt-4 self-start text-sm font-medium text-yellow-400 hover:text-yellow-300">
                    Explore Module &rarr;
               </span>
            </button>
          );
        })}
        {/* AI Chat Module Card */}
        <button
            onClick={() => navigateTo({ type: 'aiChat'})}
            className="card text-left hover:bg-slate-700 hover:shadow-purple-500/30 focus:ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-900 md:col-span-2 lg:col-span-1 flex flex-col justify-between"
            aria-label="Open AI Chat with Professor Axiom"
        >
            <div>
                <div className="flex items-start mb-3">
                    <AiIcon size={48} className="text-purple-400 mr-4 w-16 h-16 flex-shrink-0" />
                    <div>
                        <h3 className="text-2xl font-semibold text-purple-300">AI Chat</h3>
                        <p className="text-slate-300 mt-1 text-sm">Ask Professor Axiom about real-world uses of matrices.</p>
                    </div>
                </div>
                <p className="text-xs text-slate-400 group-hover:text-slate-200">
                    Explore applications in computer graphics, data science, and more.
                </p>
            </div>
            <span className="mt-4 self-start text-sm font-medium text-yellow-400 hover:text-yellow-300">
            Start Chatting &rarr;
            </span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
