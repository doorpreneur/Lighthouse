import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskLevel } from "@/lib/types";
import { useState } from "react";
import { HealthDetailSheet } from "@/components/HealthDetailSheet";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface HealthTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
}

export function HealthTable<T extends { id: string; healthScore: number; riskLevel: RiskLevel }>({ 
  title, 
  data, 
  columns
}: HealthTableProps<T>) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {data.length} records
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col, i) => (
                  <TableHead key={i} className={col.className}>{col.header}</TableHead>
                ))}
                <TableHead className="text-right">Health</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedItem(item)}
                >
                  {columns.map((col, i) => (
                    <TableCell key={i} className={col.className}>
                      {col.cell ? col.cell(item) : (col.accessorKey ? String(item[col.accessorKey]) : "")}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <HealthBadge score={item.healthScore} riskLevel={item.riskLevel} />
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <HealthDetailSheet 
        item={selectedItem} 
        open={!!selectedItem} 
        onOpenChange={(open) => !open && setSelectedItem(null)} 
      />
    </>
  );
}
