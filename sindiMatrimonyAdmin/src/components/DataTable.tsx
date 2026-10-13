import React, { useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import fastDeepEqual from 'fast-deep-equal';
import { usePerformanceTracker } from '../customHooks/usePerformanceTracker';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T;
  isLoading?: boolean;
  selectedIds?: string[];
  onSelectChange?: (selectedIds: string[]) => void;
  page?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  minWidth?: string;
}

interface DataTableRowProps<T> {
  row: T;
  rowId: string;
  columns: Column<T>[];
  hasSelection: boolean;
  isSelected: boolean;
  onSelectRow: (id: string) => void;
}

const DataTableRow = React.memo(
  function DataTableRow<T extends Record<string, any>>({
    row,
    rowId,
    columns,
    hasSelection,
    isSelected,
    onSelectRow,
  }: DataTableRowProps<T>) {
    return (
      <tr
        className={`hover:bg-slate-50/80 transition-colors ${
          isSelected ? 'bg-amber-50/40' : ''
        }`}
      >
        {hasSelection && (
          <td className="py-3.5 px-4 w-10 text-center align-middle">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelectRow(rowId)}
              className="rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
            />
          </td>
        )}
        {columns.map((col) => (
          <td
            key={col.key}
            className={`py-3.5 px-4 align-middle ${
              col.align === 'right'
                ? 'text-right'
                : col.align === 'center'
                ? 'text-center'
                : 'text-left'
            } ${col.className || ''}`}
          >
            {col.render ? col.render(row) : row[col.key]}
          </td>
        ))}
      </tr>
    );
  },
  (prev, next) => {
    if (prev.isSelected !== next.isSelected) return false;
    if (prev.rowId !== next.rowId) return false;
    if (prev.hasSelection !== next.hasSelection) return false;
    if (prev.columns !== next.columns) return false;
    if (prev.row === next.row) return true;
    return fastDeepEqual(prev.row, next.row);
  }
) as <T extends Record<string, any>>(props: DataTableRowProps<T>) => React.ReactElement;

function DataTableBase<T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id',
  isLoading = false,
  selectedIds,
  onSelectChange,
  page = 1,
  totalPages = 1,
  totalRecords,
  onPageChange,
  emptyMessage = 'No matching records found',
  minWidth = 'min-w-[800px]',
}: DataTableProps<T>) {
  usePerformanceTracker('DataTable', {
    recordCount: data?.length,
    page,
    isLoading,
    selectedCount: selectedIds?.length,
  });

  const hasSelection = Boolean(selectedIds && onSelectChange);

  // Fast O(1) Set lookup for row selection status
  const selectedSet = useMemo(() => new Set(selectedIds || []), [selectedIds]);

  const handleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onSelectChange) return;
      if (e.target.checked) {
        onSelectChange(data.map((item) => String(item[keyField])));
      } else {
        onSelectChange([]);
      }
    },
    [data, keyField, onSelectChange]
  );

  const handleSelectRow = useCallback(
    (id: string) => {
      if (!onSelectChange || !selectedIds) return;
      if (selectedSet.has(id)) {
        onSelectChange(selectedIds.filter((item) => item !== id));
      } else {
        onSelectChange([...selectedIds, id]);
      }
    },
    [onSelectChange, selectedIds, selectedSet]
  );

  const allSelected = data.length > 0 && selectedIds?.length === data.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col relative">
      {/* Subtle top loading progress bar when refreshing existing data so records never disappear */}
      {isLoading && data.length > 0 && (
        <div className="h-1 w-full bg-rose-100 overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-[#DB2F3C] via-amber-500 to-[#DB2F3C] animate-[pulse_1.2s_ease-in-out_infinite]" />
        </div>
      )}

      {/* Table Container with Horizontal Scroll for Mobile */}
      <div className="overflow-x-auto">
        <table className={`w-full text-left text-xs ${minWidth}`}>
          <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider select-none">
            <tr>
              {hasSelection && (
                <th className="py-3.5 px-4 w-10 text-center align-middle">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3.5 px-4 align-middle ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  } ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading && data.length === 0 ? (
              // Skeleton rows only on initial load when there are no records
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  {hasSelection && (
                    <td className="py-3.5 px-4">
                      <div className="w-4 h-4 bg-slate-200 rounded"></div>
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} className="py-3.5 px-4">
                      <div className="h-3.5 bg-slate-200 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasSelection ? 1 : 0)}
                  className="py-12 text-center text-slate-400"
                >
                  <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <div className="text-xs font-medium text-slate-600">{emptyMessage}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Try adjusting your filters or search keywords
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, idx) => {
                const rowId = String(row[keyField] ?? idx);
                return (
                  <DataTableRow
                    key={rowId}
                    row={row}
                    rowId={rowId}
                    columns={columns}
                    hasSelection={hasSelection}
                    isSelected={selectedSet.has(rowId)}
                    onSelectRow={handleSelectRow}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {(totalPages > 1 || totalRecords !== undefined) && (
        <div className="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/40">
          <div>
            {totalRecords !== undefined ? (
              <span>
                Showing {data.length} of {totalRecords} entries
              </span>
            ) : (
              <span>
                Page {page} of {totalPages}
              </span>
            )}
          </div>

          {totalPages > 1 && onPageChange && (
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2 font-semibold text-slate-700">
                {page} / {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const DataTable = React.memo(DataTableBase, (prevProps, nextProps) => {
  // 1. Primitive O(1) checks
  if (prevProps.page !== nextProps.page) return false;
  if (prevProps.totalPages !== nextProps.totalPages) return false;
  if (prevProps.totalRecords !== nextProps.totalRecords) return false;
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.emptyMessage !== nextProps.emptyMessage) return false;
  if (prevProps.keyField !== nextProps.keyField) return false;

  // 2. Selected IDs check (length + fast deep equality)
  if (prevProps.selectedIds !== nextProps.selectedIds) {
    if ((prevProps.selectedIds?.length ?? 0) !== (nextProps.selectedIds?.length ?? 0)) return false;
    if (!fastDeepEqual(prevProps.selectedIds, nextProps.selectedIds)) return false;
  }

  // 3. Data array check (length + fast deep equality)
  if (prevProps.data !== nextProps.data) {
    if ((prevProps.data?.length ?? 0) !== (nextProps.data?.length ?? 0)) return false;
    if (!fastDeepEqual(prevProps.data, nextProps.data)) return false;
  }

  // 4. Columns check
  if (prevProps.columns !== nextProps.columns) {
    if (prevProps.columns.length !== nextProps.columns.length) return false;
    for (let i = 0; i < prevProps.columns.length; i++) {
      const c1 = prevProps.columns[i];
      const c2 = nextProps.columns[i];
      if (
        c1.key !== c2.key ||
        c1.header !== c2.header ||
        c1.align !== c2.align ||
        c1.className !== c2.className ||
        c1.render !== c2.render
      ) {
        return false;
      }
    }
  }

  return true;
}) as typeof DataTableBase;
