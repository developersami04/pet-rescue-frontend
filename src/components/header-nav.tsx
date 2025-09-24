
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Logo } from "./icons";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-secondary text-secondary-foreground"
          : "text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground",
        className
      )}
    >
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
          variant={isActive ? "secondary" : "ghost"}
          className="text-sm font-medium"
        >
          {label}
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 mr-4">
            <Logo className="h-7 w-7 text-primary" />
            <span className="hidden text-lg font-semibold tracking-wider font-headline sm:inline-block">
              PetPal Finder
            </span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.main.map((item) => (
              <Button
                key={item.href}
                variant={usePathname() === item.href ? "secondary" : "ghost"}
                asChild
                className="text-sm font-medium"
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
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
          <Avatar className="h-9 w-9 hidden md:flex">
            <AvatarImage src="https://picsum.photos/seed/user/100/100" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          {/* Mobile Navigation */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs pr-0">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b p-4">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Logo className="h-7 w-7 text-primary" />
                    <span className="text-lg font-semibold tracking-wider font-headline">
                      PetPal Finder
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="w-full rounded-lg bg-muted pl-10"
                    />
                  </div>
                  <nav className="flex flex-col gap-2">
                    {[...navItems.main, ...navItems.pets, ...navItems.resources].map(
                      (item) => (
                        <NavLink
                          key={item.href}
                          href={item.href}
                          className="text-base"
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
                            <AvatarImage src="https://picsum.photos/seed/user/100/100" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">Guest User</p>
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
