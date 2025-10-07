
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  PawPrint,
  BookOpen,
  Search,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  PlusCircle,
  Sun,
  Moon,
  Laptop,
  Info,
  Phone,
  Shapes,
  AlertTriangle,
  Hand,
  Bell,
  FileText,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Logo } from "./icons";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAuth } from '@/lib/auth.tsx';
import { Skeleton } from "./ui/skeleton";
import { NotificationPopover } from "./notification-popover";

const navItems = {
  admin: [
    { href: "/admin/dashboard", icon: LayoutGrid, label: "Admin Dashboard" },
  ],
  approveRecords: [
    { href: "/admin/approve-reports", icon: ShieldCheck, label: "Approve Reports" },
    { href: "/admin/approve-reports?tab=verify-users", icon: UserCheck, label: "Verify Users" },
  ],
  general: [
    { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
    { href: "/pets", icon: PawPrint, label: "All Pets" },
    { href: "/pet-categories", icon: Shapes, label: "Categories" },
    { href: "/reports", icon: FileText, label: "All Reports" },
  ],
  more: [
      { href: "/about-us", icon: Info, label: "About Us" },
      { href: "/contact-us", icon: Phone, label: "Contact Us" },
      { href: "/resources", icon: BookOpen, label: "Resources" },
  ]
};

function NavLink({
  href,
  children,
  className,
  closeMenu,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  closeMenu?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={closeMenu}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors relative",
        isActive
          ? "bg-secondary text-secondary-foreground"
          : "text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground",
        className
      )}
    >
      {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full" />}
      {children}
    </Link>
  );
}

function DropdownNav({
  label,
  items,
}: {
  label: string;
  items: { href: string; icon: React.ElementType; label: string }[];
}) {
  const pathname = usePathname();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const currentTab = searchParams.get('tab');

  const isActive = items.some((item) => {
    const itemPath = item.href.split('?')[0];
    const itemQuery = new URLSearchParams(item.href.split('?')[1] || '');
    const itemTab = itemQuery.get('tab');
    
    if (pathname.startsWith(itemPath)) {
        if(itemTab) {
            return itemTab === currentTab;
        }
        if(!itemTab && !currentTab) {
           return true;
        }
    }
    return false;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
              "text-sm font-medium relative",
               isActive ? "text-primary" : "text-foreground"
            )}
        >
          {label}
          <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href} className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AdminHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme } = useTheme();
  const { user, isLoading, logout } = useAuth();
  
  const closeMobileMenu = () => setMobileMenuOpen(false);
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const displayName = user?.full_name || user?.username;
  const avatarFallback = user?.full_name ? user.full_name.charAt(0) : user?.username?.charAt(0).toUpperCase();
  const avatarSeed = user?.username;


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 mr-4">
            <Logo className="h-7 w-7 text-primary" />
            <span className="text-lg font-semibold tracking-wider font-headline">
              Petopia
            </span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 nav-break:flex">
            {navItems.admin.map((item) => {
              const isActive = pathname === item.href;
              return(
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn("text-sm font-medium relative", isActive ? "text-primary" : "text-foreground")}
              >
                <Link href={item.href}>
                  {item.label}
                  {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full" />}
                  </Link>
              </Button>
            )})}
            <DropdownNav label="Approve Records" items={navItems.approveRecords} />
            <DropdownNav label="General" items={navItems.general} />
            <DropdownNav label="More" items={navItems.more} />
             <Button asChild size="sm" className="ml-4">
                <Link href="/submit-request">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Pet Request
                </Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-48 rounded-lg bg-background pl-10"
            />
          </div>
          
          <NotificationPopover />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               {isLoading && !user ? (
                 <Skeleton className="h-9 w-9 rounded-full" />
               ) : (
                <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarImage src={user?.profile_image ?? `https://picsum.photos/seed/${avatarSeed}/100`} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
               )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="font-semibold">{displayName}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                 <Link href="/notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </Link>
              </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <Laptop className="mr-2 h-4 w-4" />
                      <span>System</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Navigation */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="nav-break:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs p-0">
              <SheetHeader className="border-b p-4">
                 <SheetTitle>
                  <VisuallyHidden>Mobile Navigation Menu</VisuallyHidden>
                </SheetTitle>
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={closeMobileMenu}
                >
                  <Logo className="h-7 w-7 text-primary" />
                  <span className="text-lg font-semibold tracking-wider font-headline">
                    Petopia
                  </span>
                </Link>
              </SheetHeader>
              <div className="flex h-full flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="w-full rounded-lg bg-muted pl-10"
                    />
                  </div>
                  <nav className="flex flex-col gap-1">
                    {[...navItems.admin, ...navItems.approveRecords, ...navItems.general, ...navItems.more].map(
                      (item) => (
                        <NavLink
                          key={item.href}
                          href={item.href}
                          className="text-base"
                          closeMenu={closeMobileMenu}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </NavLink>
                      )
                    )}
                    <NavLink
                        href="/submit-request"
                        className="text-base mt-2 bg-primary/10 text-primary"
                        closeMenu={closeMobileMenu}
                        >
                        <PlusCircle className="h-5 w-5" />
                        Pet Request Form
                    </NavLink>
                  </nav>
                </div>
                 <div className="border-t p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                             {isLoading && !user ? (
                                <Skeleton className="h-9 w-9 rounded-full" />
                             ) : (
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user?.profile_image ?? `https://picsum.photos/seed/${avatarSeed}/100`} />
                                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                                </Avatar>
                             )}
                            <div>
                                {isLoading && !user ? (
                                    <div className="space-y-1">
                                      <Skeleton className="h-4 w-24" />
                                      <Skeleton className="h-3 w-32" />
                                    </div>
                                ) : (
                                   <div>
                                    <p className="text-sm font-medium">{displayName}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                   </div>
                                )}
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleLogout}>
                            <LogOut className="h-5 w-5" />
                            <span className="sr-only">Log out</span>
                        </Button>
                    </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
