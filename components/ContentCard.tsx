import React from 'react';

interface ContentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`card bg-slate-800 ${className}`}>
      <h3 className="text-xl font-semibold text-sky-400 mb-3 border-b border-slate-700 pb-2 shiny-text">{title}</h3>
      <div className="text-slate-200">
        {children}
      </div>
    </div>
  );
};

export default ContentCard;