import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  DoorOpen, 
  UserCircle, 
  Workflow, 
  Briefcase,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Owners", icon: Users, href: "/owners" },
  { label: "Buildings", icon: Building2, href: "/buildings" },
  { label: "Units", icon: DoorOpen, href: "/units" },
  { label: "Tenants", icon: UserCircle, href: "/tenants" },
  { label: "Workflows", icon: Workflow, href: "/workflows" },
  { label: "Team", icon: Briefcase, href: "/team" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const NavContent = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
            H
          </div>
          HealthSystem
        </h2>
        <div className="space-y-1 mt-6">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={location === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Mobile Navigation */}
      <div className="md:hidden border-b p-4 flex items-center justify-between bg-card">
        <div className="font-semibold text-lg flex items-center gap-2">
           <div className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
            H
          </div>
          HealthSystem
        </div>
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 border-r min-h-screen bg-sidebar sticky top-0 h-screen overflow-y-auto">
          <NavContent />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
