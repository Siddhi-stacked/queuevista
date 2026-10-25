import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T | ((item: T) => string);
  emptyMessage?: string;
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  emptyMessage = 'No records found.',
  isLoading = false,
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  const getKey = (item: T, index: number): string => {
    if (typeof keyField === 'function') return keyField(item);
    return String(item[keyField] ?? index);
  };

  return (
    <div className={`w-full overflow-x-auto rounded border border-[#E5E7EB] bg-white ${className}`}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#475569] font-medium text-xs uppercase tracking-wider">
            {columns.map((col) => (
              <th key={col.key} className={`py-3 px-4 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F1F5F9] text-[#1E293B]">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-sm text-[#64748B]">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Loading data...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-sm text-[#64748B]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={getKey(item, index)}
                onClick={() => onRowClick && onRowClick(item)}
                className={`transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-[#F8FAFC]' : 'hover:bg-slate-50/50'
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`py-3 px-4 text-xs sm:text-sm ${col.className || ''}`}>
                    {col.render ? col.render(item, index) : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
