import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { ChevronRight, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskLevel } from "@/lib/types";
import { useState } from "react";
import { HealthDetailSheet } from "@/components/HealthDetailSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      <Card className="border-0 shadow-soft rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-card px-6 py-5">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Managing {data.length} active records
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-lg h-9">
              Export
            </Button>
            <Input 
              placeholder="Search..." 
              className="h-9 w-[200px] rounded-lg bg-background" 
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                {columns.map((col, i) => (
                  <TableHead key={i} className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-foreground">
                      {col.header}
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    </div>
                  </TableHead>
                ))}
                <TableHead className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 text-right">Health</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors border-border/50 group"
                  onClick={() => setSelectedItem(item)}
                >
                  {columns.map((col, i) => (
                    <TableCell key={i} className="py-4 font-medium text-sm text-foreground/80">
                      {col.cell ? col.cell(item) : (col.accessorKey ? String(item[col.accessorKey]) : "")}
                    </TableCell>
                  ))}
                  <TableCell className="text-right py-4">
                    <HealthBadge score={item.healthScore} riskLevel={item.riskLevel} />
                  </TableCell>
                  <TableCell className="py-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
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
