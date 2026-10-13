import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-1 ${className}`}
    >
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {badge}
        </div>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      {actions && (
        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
};
