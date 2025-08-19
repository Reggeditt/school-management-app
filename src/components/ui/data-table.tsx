'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface FilterOption {
  label: string;
  value: string;
  options: { label: string; value: string }[];
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title: string;
  description: string;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  actions?: (record: T) => React.ReactNode;
  loading?: boolean;
  onAdd?: () => void;
  addButtonText?: string;
  onExport?: () => void;
  exportButtonText?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  title,
  description,
  searchPlaceholder = "Search...",
  filters = [],
  actions,
  loading = false,
  onAdd,
  addButtonText = "Add New",
  onExport,
  exportButtonText = "Export"
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter and search data
  const filteredData = data.filter(item => {
    // Search filter
    const searchMatch = searchTerm === '' || 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Custom filters
    const filterMatch = Object.entries(filterValues).every(([filterKey, filterValue]) => {
      if (!filterValue || filterValue === 'all') return true;
      return String((item as any)[filterKey]) === filterValue;
    });

    return searchMatch && filterMatch;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = String((a as any)[sortColumn]).toLowerCase();
    const bValue = String((b as any)[sortColumn]).toLowerCase();
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            {onExport && (
              <Button variant="outline" onClick={onExport}>
                📊 {exportButtonText}
              </Button>
            )}
            {onAdd && (
              <Button onClick={onAdd}>
                ➕ {addButtonText}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex gap-4 items-center mb-6">
          <div className="flex-1">
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filters.map((filter) => (
            <Select
              key={filter.value}
              value={filterValues[filter.value] || 'all'}
              onValueChange={(value) => handleFilterChange(filter.value, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={String(column.key)}
                    className={column.sortable ? "cursor-pointer hover:bg-muted/50" : ""}
                    onClick={() => column.sortable && handleSort(String(column.key))}
                  >
                    <div className="flex items-center gap-2">
                      {column.title}
                      {column.sortable && sortColumn === column.key && (
                        <span className="text-xs">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
                {actions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length + (actions ? 1 : 0)} 
                    className="text-center py-8 text-muted-foreground"
                  >
                    No data found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((record) => (
                  <TableRow key={record.id}>
                    {columns.map((column) => (
                      <TableCell key={String(column.key)}>
                        {column.render 
                          ? column.render((record as any)[column.key], record)
                          : String((record as any)[column.key] || '-')
                        }
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell>
                        {actions(record)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Results summary */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {sortedData.length} of {data.length} records
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
