import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from './table';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Loader2, RefreshCw, Download } from 'lucide-react';
import type { LoadingState } from '../../types';

interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string | null;
  loadingState?: LoadingState;
  onRefresh?: () => void;
  onExport?: () => void;
  onSort?: (column: keyof T, direction: 'asc' | 'desc') => void;
  emptyMessage?: string;
  className?: string;
  showActions?: boolean;
  actions?: (item: T, index: number) => React.ReactNode;
  footer?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error = null,
  loadingState = 'idle',
  onRefresh,
  onExport,
  onSort,
  emptyMessage = 'No data available',
  className = '',
  showActions = false,
  actions,
  footer,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof T) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
    onSort?.(column, newDirection === 'asc' ? 'desc' : 'asc');
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const renderCell = (column: Column<T>, item: T, index: number) => {
    const value = item[column.key];
    
    if (column.render) {
      return column.render(value, item, index);
    }
    
    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>;
    }
    
    return <span>{String(value)}</span>;
  };

  if (loading && loadingState === 'loading') {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-red-500 mb-2">Error: {error}</div>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-gray-500 text-center">
            {emptyMessage}
          </div>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline" size="sm" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        {/* Header with actions */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">Data Table</h3>
            <span className="text-sm text-gray-500">
              {data.length} {data.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {onExport && (
              <Button onClick={onExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={column.className}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.title}</span>
                      {column.sortable && (
                        <button
                          onClick={() => handleSort(column.key)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            className={`w-4 h-4 transform transition-transform ${
                              sortColumn === column.key && sortDirection === 'desc'
                                ? 'rotate-180'
                                : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </TableHead>
                ))}
                {showActions && <TableHead className="w-20">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.key)}
                      className={column.className}
                    >
                      {renderCell(column, item, index)}
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell className="w-20">
                      <div className="flex space-x-1">
                        {actions?.(item, index)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
            {footer && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={columns.length + (showActions ? 1 : 0)}>
                    {footer}
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for managing table state
export function useDataTable<T extends Record<string, any>>(
  fetchData: () => Promise<T[]>,
  options?: {
    initialSortColumn?: keyof T;
    initialSortDirection?: 'asc' | 'desc';
  }
) {
  const [data, setData] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loadingState, setLoadingState] = React.useState<LoadingState>('idle');
  const [sortColumn, setSortColumn] = React.useState<keyof T | null>(
    options?.initialSortColumn || null
  );
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(
    options?.initialSortDirection || 'asc'
  );

  const refresh = React.useCallback(async () => {
    try {
      setLoading(true);
      setLoadingState('loading');
      setError(null);
      
      const result = await fetchData();
      setData(result);
      setLoadingState('success');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch data';
      setError(errorMessage);
      setLoadingState('error');
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const sort = React.useCallback((column: keyof T, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
  }, []);

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  React.useEffect(() => {
    refresh();
  }, []);

  return {
    data: sortedData,
    loading,
    error,
    loadingState,
    sort,
    sortColumn,
    sortDirection,
    refresh,
    setSortColumn,
    setSortDirection,
  };
}
