import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  emptyState?: ReactNode;
  className?: string;
}

export function DataTable<T>({ 
  data, 
  columns, 
  onRowClick,
  sortColumn,
  sortDirection,
  onSort,
  emptyState,
  className
}: DataTableProps<T>) {
  const getSortIcon = (columnKey: string) => {
    if (sortColumn !== columnKey) {
      return <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={cn('rounded-lg border border-border overflow-hidden', className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            {columns.map((column) => (
              <TableHead 
                key={column.key}
                className={cn(
                  'text-xs font-semibold text-muted-foreground uppercase tracking-wider',
                  column.sortable && 'cursor-pointer select-none hover:text-foreground',
                  column.className
                )}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="flex items-center gap-1.5">
                  {column.header}
                  {column.sortable && getSortIcon(column.key)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow 
              key={index}
              className={cn(
                'transition-colors',
                onRowClick && 'cursor-pointer hover:bg-muted/50'
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <TableCell 
                  key={column.key}
                  className={cn('py-4', column.className)}
                >
                  {column.render(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
