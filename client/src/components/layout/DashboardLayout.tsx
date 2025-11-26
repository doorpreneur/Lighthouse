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
  Search,
  Bell,
  Settings,
  HelpCircle
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, href: "/" },
  { label: "Owners", icon: Users, href: "/owners" },
  { label: "Buildings", icon: Building2, href: "/buildings" },
  { label: "Units", icon: DoorOpen, href: "/units" },
  { label: "Tenants", icon: UserCircle, href: "/tenants" },
  { label: "Workflows", icon: Workflow, href: "/workflows" },
  { label: "Team", icon: Briefcase, href: "/team" },
];

const BOTTOM_NAV_ITEMS = [
  { label: "Help and Support", icon: HelpCircle, href: "/help" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full py-6">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/30">
            ∞
          </div>
          <span className="font-bold text-xl tracking-tight">PropHealth.</span>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-1">
        <div className="text-xs font-semibold text-muted-foreground/50 px-4 mb-4 uppercase tracking-wider">
          General
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start mb-1 rounded-xl font-medium transition-all duration-200",
                  isActive 
                    ? "bg-sidebar-accent text-primary shadow-sm" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-primary"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </div>

      <div className="px-4 mt-auto space-y-1">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className="w-full justify-start rounded-xl text-muted-foreground hover:text-primary"
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </Button>
        ))}
        
        <div className="mt-6 pt-6 border-t px-2 flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">admin@prophealth.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[280px] border-r bg-sidebar sticky top-0 h-screen overflow-y-auto shadow-sm z-10">
        <NavContent />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 md:h-20 border-b bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="md:hidden">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px] bg-sidebar border-r-0">
                <NavContent />
              </SheetContent>
            </Sheet>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center w-full max-w-md ml-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search anything..." 
                className="pl-10 bg-background border-transparent focus:bg-white focus:border-primary/20 transition-all rounded-xl shadow-sm"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto w-full space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
