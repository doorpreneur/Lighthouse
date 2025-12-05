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
  PanelLeft,
  ChevronDown
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

// Removed BOTTOM_NAV_ITEMS as they are moving to header

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
      {/* Removed Logo Area */}
      <div className="flex-1 px-4 space-y-1 mt-4">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} item={item} collapsed={collapsed} />
        ))}
      </div>
      {/* Removed User Profile and Bottom Nav */}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background font-sans overflow-hidden">
      {/* Full Width Header */}
      <header className="h-16 shrink-0 bg-primary px-6 flex items-center justify-between z-20 shadow-md text-primary-foreground">
        
        {/* Left: Logo & Toggle */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 hidden md:flex h-8 w-8"
          >
             <PanelLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="h-8 w-8 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-lg shadow-inner backdrop-blur-sm transition-transform group-hover:scale-105 shrink-0 border border-white/30">
              ∞
            </div>
            <span className="font-display font-bold text-xl tracking-tighter text-white">
              PropHealth.
            </span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center max-w-2xl px-8">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/60 group-focus-within:text-primary-foreground transition-colors" />
            <Input 
              placeholder="Search anything..." 
              className="pl-10 bg-white/10 border-transparent text-primary-foreground placeholder:text-primary-foreground/50 focus:bg-white/20 focus:border-white/30 transition-all rounded-xl shadow-none hover:bg-white/15 h-10 w-full"
            />
          </div>
        </div>

        {/* Right: Help & User */}
        <div className="flex items-center gap-4 md:gap-6">
          <Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-white hover:bg-white/10 gap-2 hidden sm:flex">
            <HelpCircle className="h-5 w-5" />
            <span>Help</span>
          </Button>
          
          <div className="h-6 w-px bg-white/20 hidden sm:block" />

          <Button variant="ghost" size="icon" className="rounded-full text-primary-foreground/80 hover:text-white hover:bg-white/10 transition-colors">
             <Bell className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2 cursor-pointer pl-2">
            <Avatar className="h-9 w-9 border-2 border-white/20 shadow-sm shrink-0 bg-amber-400 text-amber-950">
              <AvatarFallback className="bg-amber-400 text-amber-950 font-bold text-xs">AS</AvatarFallback>
            </Avatar>
            <ChevronDown className="h-4 w-4 text-primary-foreground/60" />
          </div>
          
          {/* Mobile Menu Trigger */}
          <div className="md:hidden ml-2">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[240px] bg-sidebar border-r-0">
                <NavContent collapsed={false} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div 
          className={cn(
            "hidden md:block border-r bg-slate-100 overflow-y-auto shadow-inner z-10 transition-all duration-300 ease-in-out",
            isCollapsed ? "w-[80px]" : "w-[240px]"
          )}
        >
          <NavContent collapsed={isCollapsed} />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-auto bg-background">
          <div className="w-full space-y-6 pb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
