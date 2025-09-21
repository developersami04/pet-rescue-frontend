"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutGrid,
  PawPrint,
  Map,
  Sparkles,
  HeartHandshake,
  BookOpen,
} from "lucide-react";
import { Logo } from "./icons";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const navItems = [
  { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { href: "/pets", icon: PawPrint, label: "Find a Pet" },
  { href: "/map", icon: Map, label: "Map View" },
  { href: "/matching", icon: Sparkles, label: "AI Pet Matcher" },
  { href: "/pet-care", icon: HeartHandshake, label: "Pet Care AI" },
  { href: "/resources", icon: BookOpen, label: "Resources" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="size-7 shrink-0 text-primary" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-wider font-headline">PetPal Finder</h2>
          </div>
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter>
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton>
                    <Avatar className="size-8">
                        <AvatarImage src="https://picsum.photos/seed/user/100/100" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span>Guest User</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
