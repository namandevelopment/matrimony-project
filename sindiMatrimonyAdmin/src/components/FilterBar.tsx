import { Search } from 'lucide-react';
import { memoWithDeepEqual } from '../utils/memoUtils';
import { CustomTextInput } from './CustomTextInput';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  filters?: React.ReactNode;
  onClear?: () => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = memoWithDeepEqual(({
  search,
  onSearchChange,
  placeholder = 'Search records...',
  filters,
  onClear,
  className = '',
}) => {
  return (
    <div
      className={`bg-white p-3 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs ${className}`}
    >
      <div className="flex-1 min-w-[200px]">
        <CustomTextInput
          size="sm"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
          clearable
          onClear={() => onSearchChange('')}
        />
      </div>

      {filters && (
        <div className="flex items-center gap-2 justify-start md:justify-end flex-wrap sm:flex-nowrap shrink-0">
          {filters}
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-slate-500 hover:text-rose-600 underline px-1.5 font-medium cursor-pointer shrink-0 whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
});

FilterBar.displayName = 'FilterBar';
