
'use client';

import Link from "next/link";
import { Sun, Moon, Laptop, ChevronDown, Info, Phone, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const moreNavItems = [
    { href: "/about-us", icon: Info, label: "About Us" },
    { href: "/contact-us", icon: Phone, label: "Contact Us" },
    { href: "/resources", icon: BookOpen, label: "Resources" },
];

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
              "text-sm font-medium",
               isActive ? "text-primary" : "text-foreground"
            )}
        >
          {label}
          <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
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


export function UnauthenticatedHeader() {
    const { setTheme } = useTheme();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Logo />
        </Link>
        <nav className="flex items-center gap-2">
            <DropdownNav label="More" items={moreNavItems} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Laptop className="mr-2 h-4 w-4" />
                    System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/create-account">Create Account</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
