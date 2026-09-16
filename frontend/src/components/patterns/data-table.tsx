import type { ReactNode } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/patterns/empty-state";

export interface DataTableColumn<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  loading,
  emptyTitle,
  emptyDescription,
  rowActions,
}: {
  columns: DataTableColumn<T>[];
  rows: T[] | undefined;
  loading?: boolean;
  emptyTitle: string;
  emptyDescription?: string;
  rowActions?: (row: T) => ReactNode;
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-card">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-card">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.header}>{col.header}</TableHead>
            ))}
            {rowActions && <TableHead className="text-right">Aksi</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((col) => (
                <TableCell key={col.header} className={col.className}>
                  {col.cell(row)}
                </TableCell>
              ))}
              {rowActions && <TableCell className="text-right">{rowActions(row)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
