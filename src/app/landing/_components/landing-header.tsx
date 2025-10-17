
'use client';

import Link from "next/link";
import { Sun, Moon, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/logo";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
    // All items removed as per request
];

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Button variant="ghost" asChild className="relative">
            <Link href={href}>
                {children}
                {isActive && (
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        layoutId="underline"
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                )}
            </Link>
        </Button>
    )
}

export function LandingHeader() {
    const { setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <motion.div whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
                <Logo />
            </Link>
        </motion.div>
        <nav className="flex items-center gap-1">
            {navItems.map((item) => (
                <NavItem key={item.href} href={item.href}>{item.label}</NavItem>
            ))}
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
