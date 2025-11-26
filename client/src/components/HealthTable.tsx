import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { ChevronRight, ArrowUpDown, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskLevel } from "@/lib/types";
import { useState, useMemo } from "react";
import { HealthDetailSheet } from "@/components/HealthDetailSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  filterColumn?: keyof T; // Optional text search column
}

export function HealthTable<T extends { id: string; healthScore: number; riskLevel: RiskLevel }>({ 
  title, 
  data, 
  columns,
  filterColumn = "name" as keyof T // Default to name if exists, can be overridden
}: HealthTableProps<T>) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RiskLevel | "all">("all");

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Status Filter
      if (statusFilter !== "all" && item.riskLevel !== statusFilter) return false;
      
      // Text Search
      if (searchQuery) {
        const val = String(item[filterColumn] || "").toLowerCase();
        if (!val.includes(searchQuery.toLowerCase())) return false;
      }
      
      return true;
    });
  }, [data, statusFilter, searchQuery, filterColumn]);

  return (
    <>
      <Card className="border-0 shadow-soft rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 card-gradient">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/50 bg-white/50 backdrop-blur-sm px-6 py-5 gap-4">
          <div>
            <CardTitle className="text-lg font-display font-bold text-foreground tracking-tight">{title}</CardTitle>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              SHOWING {filteredData.length} OF {data.length} RECORDS
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-[180px]">
              <Select 
                value={statusFilter} 
                onValueChange={(val) => setStatusFilter(val as RiskLevel | "all")}
              >
                <SelectTrigger className="h-9 bg-white border-primary/10 focus:ring-primary/20">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Filter className="w-3.5 h-3.5" />
                    <SelectValue placeholder="Filter Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="watch">Watch</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Input 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full sm:w-[200px] rounded-lg bg-white focus:bg-white transition-colors border-transparent hover:shadow-sm border-primary/10" 
            />
            
            <Button variant="outline" size="sm" className="rounded-lg h-9 font-medium hover:bg-primary/5 hover:text-primary border-primary/10 bg-white hidden sm:flex">
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                {columns.map((col, i) => (
                  <TableHead key={i} className="h-12 text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground/70">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                      {col.header}
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    </div>
                  </TableHead>
                ))}
                <TableHead className="h-12 text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground/70 text-right">Health</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className="cursor-pointer hover:bg-primary/5 hover:translate-x-1 transition-all duration-200 border-border/50 group"
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
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all rounded-full hover:bg-primary/10 hover:text-primary">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 2} className="h-24 text-center text-muted-foreground">
                    No records found matching your filters.
                  </TableCell>
                </TableRow>
              )}
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
