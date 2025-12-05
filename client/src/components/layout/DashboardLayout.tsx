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
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  PanelLeft
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const NavItem = ({ item, collapsed }: { item: typeof NAV_ITEMS[0], collapsed: boolean }) => {
    const isActive = location === item.href;
    
    const button = (
      <Button
        variant="ghost"
        className={cn(
          "w-full mb-1 rounded-xl font-medium transition-all duration-200 h-9 text-sm",
          collapsed ? "justify-center px-0" : "justify-start",
          isActive 
            ? "bg-sidebar-accent text-primary shadow-sm" + (collapsed ? "" : " translate-x-1")
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-primary" + (collapsed ? "" : " hover:translate-x-1")
        )}
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-3", isActive ? "text-primary" : "text-muted-foreground")} />
        {!collapsed && item.label}
      </Button>
    );

    if (collapsed) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={item.href}>{button}</Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {item.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <Link href={item.href}>{button}</Link>;
  };

  const NavContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full py-6">
      <div className={cn("mb-8 flex transition-all duration-300", collapsed ? "flex-col items-center justify-center gap-4 px-2" : "items-center justify-between px-6")}>
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/30 transition-transform group-hover:scale-105 shrink-0">
            ∞
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-xl tracking-tighter animate-in fade-in slide-in-from-left-2 duration-300">
              PropHealth.
            </span>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("text-muted-foreground hover:text-primary hover:bg-primary/10 hidden md:flex", collapsed && "h-8 w-8")}
        >
           <PanelLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 px-4 space-y-1">
        {collapsed && <div className="h-4 mb-4" />} {/* Spacer for alignment */}
        
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} item={item} collapsed={collapsed} />
        ))}
      </div>

      <div className="px-4 mt-auto space-y-1">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <NavItem key={item.href} item={item} collapsed={collapsed} />
        ))}
        
        <div className={cn(
          "mt-6 pt-6 border-t flex items-center gap-3 cursor-pointer hover:bg-sidebar-accent/30 rounded-xl transition-all duration-200",
          collapsed ? "justify-center px-0 py-4 mx-0" : "px-2 py-2"
        )}>
          <Avatar className="h-9 w-9 border-2 border-white shadow-sm shrink-0">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
              <p className="text-sm font-medium truncate font-display">Admin User</p>
              <p className="text-xs text-muted-foreground truncate font-mono">admin@prophealth.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans flex">
      {/* Desktop Sidebar */}
      <div 
        className={cn(
          "hidden md:block border-r bg-slate-100 sticky top-0 h-screen overflow-y-auto shadow-sm z-10 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[80px]" : "w-[240px]"
        )}
      >
        <NavContent collapsed={isCollapsed} />
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
              <SheetContent side="left" className="p-0 w-[240px] bg-sidebar border-r-0">
                <NavContent collapsed={false} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center w-full max-w-md ml-4">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search anything..." 
                className="pl-10 bg-background border-transparent focus:bg-white focus:border-primary/20 transition-all rounded-xl shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-auto">
          <div className="w-full space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
