

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  PawPrint,
  Map,
  Sparkles,
  HeartHandshake,
  BookOpen,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  Inbox,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Logo } from "./icons";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { sampleUser } from "@/lib/user-data";

const navItems = {
  main: [{ href: "/dashboard", icon: LayoutGrid, label: "Dashboard" }],
  pets: [
    { href: "/pets", icon: PawPrint, label: "Find a Pet" },
    { href: "/map", icon: Map, label: "Map View" },
    { href: "/matching", icon: Sparkles, label: "AI Pet Matcher" },
  ],
  resources: [
    { href: "/pet-care", icon: HeartHandshake, label: "Pet Care AI" },
    { href: "/resources", icon: BookOpen, label: "Resources" },
  ],
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
  const isActive = items.some((item) => pathname.startsWith(item.href));
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

export function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 mr-4">
            <Logo className="h-7 w-7 text-primary" />
            <span className="hidden text-lg font-semibold tracking-wider font-headline sm:inline-block">
              Pet-Pal
            </span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.main.map((item) => {
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
            <DropdownNav label="Pets" items={navItems.pets} />
            <DropdownNav label="Resources" items={navItems.resources} />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-48 rounded-lg bg-background pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src={sampleUser.profile_image ?? `https://picsum.photos/seed/${sampleUser.username}/100/100`} />
                <AvatarFallback>{sampleUser.first_name.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
                 <Link href="#">
                  <Inbox className="mr-2 h-4 w-4" />
                  <span>Inbox</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                 <Link href="#">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Navigation */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs p-0">
              <SheetHeader className="flex flex-row items-center justify-between border-b p-4">
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
                    Pet-Pal
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMobileMenu}
                  className="absolute right-4 top-3"
                >
                  <X className="h-6 w-6" />
                   <span className="sr-only">Close menu</span>
                </Button>
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
                    {[...navItems.main, ...navItems.pets, ...navItems.resources].map(
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
                  </nav>
                </div>
                 <div className="border-t p-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={sampleUser.profile_image ?? `https://picsum.photos/seed/${sampleUser.username}/100/100`} />
                            <AvatarFallback>{sampleUser.first_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">{sampleUser.first_name} {sampleUser.last_name}</p>
                        </div>
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
