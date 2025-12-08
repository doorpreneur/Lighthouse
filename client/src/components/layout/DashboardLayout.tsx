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
  ChevronDown,
  TrendingUp,
  FileText,
  Link as LinkIcon,
  AlertTriangle,
  Zap
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type NavItem = {
  label: string;
  icon: any;
  href: string;
};

type NavSection = {
  title?: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { label: "Overview", icon: LayoutDashboard, href: "/" },
    ]
  },
  {
    title: "ENTITIES",
    items: [
      { label: "Owners", icon: Users, href: "/owners" },
      { label: "Properties", icon: Building2, href: "/properties" },
      { label: "Units", icon: DoorOpen, href: "/units" },
      { label: "Tenants", icon: UserCircle, href: "/tenants" },
    ]
  },
  {
    title: "OPERATIONS",
    items: [
      { label: "Workflows", icon: Workflow, href: "/workflows" },
      { label: "Team", icon: Briefcase, href: "/team" },
    ]
  },
  {
    title: "INTELLIGENCE",
    items: [
      { label: "Alerts & Prescriptions", icon: AlertTriangle, href: "/alerts" },
      { label: "Insights", icon: TrendingUp, href: "/insights" },
      { label: "Automations", icon: Zap, href: "/automations" },
    ]
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Reports", icon: FileText, href: "/reports" },
      { label: "Integrations", icon: LinkIcon, href: "/integrations" },
      { label: "Settings", icon: Settings, href: "/settings" },
    ]
  }
];

import logoUrl from '@assets/generated_images/minimalist_lighthouse_logo_icon_in_white_and_blue.png';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const NavItem = ({ item, collapsed }: { item: NavItem, collapsed: boolean }) => {
    const isActive = location === item.href;
    
    const button = (
      <Button
        variant="ghost"
        className={cn(
          "w-full mb-1 rounded-xl font-medium transition-all duration-200 h-9 text-sm",
          collapsed ? "justify-center px-0" : "justify-start",
          isActive 
            ? "bg-sidebar-accent text-primary shadow-sm" + (collapsed ? "" : " translate-x-1")
            : "text-sidebar-foreground hover:bg-slate-200 hover:text-primary" + (collapsed ? "" : " hover:translate-x-1")
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
      <div className="flex-1 px-4 space-y-1 mt-4">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className={cn("mb-4", idx === 0 ? "mb-6" : "")}>
            {section.title && !collapsed && (
              <h4 className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider mb-2 px-2">
                {section.title}
              </h4>
            )}
            {section.title && collapsed && (
              <div className="h-px w-4 bg-border/50 mx-auto my-3" />
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavItem key={item.href} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background font-sans overflow-hidden">
      {/* Full Width Header */}
      <header className="h-16 shrink-0 bg-primary px-6 flex items-center justify-between z-20 shadow-md text-primary-foreground">
        
        {/* Left: Logo & Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="shrink-0 transition-transform group-hover:scale-105">
              <img src={logoUrl} alt="Lighthouse Logo" className="h-10 w-10 object-contain mix-blend-screen" />
            </div>
            <span className="font-display font-bold text-xl tracking-tighter text-white">
              Lighthouse.
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
            <Avatar className="h-9 w-9 border-2 border-white/20 shadow-sm shrink-0">
              <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&fit=crop" alt="Admin User" />
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
            "hidden md:block border-r bg-slate-100 shadow-inner z-10 transition-all duration-300 ease-in-out relative group",
            isCollapsed ? "w-[80px]" : "w-[240px]"
          )}
        >
          <div className="absolute -right-3 top-6 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="default"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-6 w-6 rounded-full shadow-md bg-primary hover:bg-primary/90 border-2 border-white"
            >
               {isCollapsed ? <ChevronRight className="h-3 w-3 text-white" /> : <ChevronLeft className="h-3 w-3 text-white" />}
            </Button>
          </div>
          <div className="h-full overflow-y-auto overflow-x-hidden">
            <NavContent collapsed={isCollapsed} />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto bg-background transition-all duration-300">
          <div className="w-full space-y-6 pb-20 max-w-[1800px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
