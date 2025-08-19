'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getNavigationIcon } from './navigation-icons';

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  minWidth?: string;
  render?: (value: any, item: T, index: number) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  className?: string;
  emptyStateMessage?: string;
  loading?: boolean;
  actions?: {
    create?: {
      label: string;
      onClick: () => void;
    };
    bulk?: Array<{
      label: string;
      onClick: (selectedItems: T[]) => void;
    }>;
  };
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Search...",
  searchKeys,
  sortable = true,
  pagination = true,
  pageSize = 10,
  className,
  emptyStateMessage = "No data available",
  loading = false,
  actions,
  selectable = false,
  onSelectionChange,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  // Filter data based on search
  const filteredData = searchable && searchTerm
    ? data.filter(item => {
        if (searchKeys) {
          return searchKeys.some(key => {
            const value = item[key];
            return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
          });
        }
        return Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : data;

  // Sort data
  const sortedData = sortConfig
    ? [...filteredData].sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key);
        const bValue = getNestedValue(b, sortConfig.key);
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : filteredData;

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    
    setSortConfig(current => {
      if (current?.key === columnKey) {
        if (current.direction === 'asc') {
          return { key: columnKey, direction: 'desc' };
        } else {
          return null; // Remove sorting
        }
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([]);
      onSelectionChange?.([]);
    } else {
      setSelectedItems(paginatedData);
      onSelectionChange?.(paginatedData);
    }
  };

  const handleSelectItem = (item: T) => {
    const newSelection = selectedItems.find(selected => selected.id === item.id)
      ? selectedItems.filter(selected => selected.id !== item.id)
      : [...selectedItems, item];
    
    setSelectedItems(newSelection);
    onSelectionChange?.(newSelection);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        {searchable && (
          <div className="relative flex-1 max-w-sm">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {getNavigationIcon('search')}
            </div>
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        <div className="flex gap-2">
          {actions?.create && (
            <Button onClick={actions.create.onClick}>
              {getNavigationIcon('plus')}
              <span className="ml-2">{actions.create.label}</span>
            </Button>
          )}
          
          {actions?.bulk && selectedItems.length > 0 && (
            <div className="flex gap-2">
              {actions.bulk.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => action.onClick(selectedItems)}
                >
                  {action.label} ({selectedItems.length})
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-muted/50">
              <tr>
                {selectable && (
                  <th className="w-12 p-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                )}
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={cn(
                      "text-left p-3 font-medium text-sm text-muted-foreground",
                      column.sortable !== false && sortable ? "cursor-pointer hover:text-foreground" : "",
                      column.className
                    )}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth || '120px'
                    }}
                    onClick={() => column.sortable !== false && handleSort(column.key as string)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable !== false && sortable && (
                        <span className="text-xs">
                          {sortConfig?.key === column.key ? (
                            sortConfig.direction === 'asc' 
                              ? getNavigationIcon('chevron-up')
                              : getNavigationIcon('chevron-down')
                          ) : (
                            <span className="opacity-50">{getNavigationIcon('chevron-up')}</span>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td 
                    colSpan={columns.length + (selectable ? 1 : 0)} 
                    className="p-8 text-center text-muted-foreground"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin">{getNavigationIcon('loader')}</div>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td 
                    colSpan={columns.length + (selectable ? 1 : 0)} 
                    className="p-8 text-center text-muted-foreground"
                  >
                    {emptyStateMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, rowIndex) => (
                  <tr 
                    key={item.id} 
                    className="border-t hover:bg-muted/50 transition-colors"
                  >
                    {selectable && (
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.some(selected => selected.id === item.id)}
                          onChange={() => handleSelectItem(item)}
                          className="rounded border-gray-300"
                        />
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={cn("p-3 text-sm", column.className)}
                        style={{
                          width: column.width,
                          minWidth: column.minWidth || '120px'
                        }}
                      >
                        {column.render
                          ? column.render(getNestedValue(item, column.key as string), item, rowIndex)
                          : getNestedValue(item, column.key as string)
                        }
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
            {sortedData.length} results
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              {getNavigationIcon('chevron-left')}
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              {getNavigationIcon('chevron-right')}
            </Button>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {searchTerm && (
        <div className="text-sm text-muted-foreground">
          Found {filteredData.length} result{filteredData.length !== 1 ? 's' : ''} for "{searchTerm}"
        </div>
      )}
    </div>
  );
}

// Helper function to get nested values
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Export helper function for status badges
export function StatusBadge({ 
  status, 
  variant = "default" 
}: { 
  status: string; 
  variant?: "default" | "secondary" | "destructive" | "outline";
}) {
  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
}
