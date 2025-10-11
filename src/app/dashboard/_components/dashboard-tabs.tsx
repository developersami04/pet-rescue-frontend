
'use client';

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PawPrint, AlertTriangle, Search, Hand, FileText, Inbox, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const tabInfo = [
    { value: "my-pets", label: "My Pets", icon: PawPrint },
    { value: "favorites", label: "Favorites", icon: Heart },
    { value: "lost-pets", label: "Lost Pets", icon: AlertTriangle },
    { value: "found-pets", label: "Found Pets", icon: Search },
    { value: "adoptable-pets", label: "Adoptable", icon: Hand },
    { value: "my-requests", label: "My Requests", icon: FileText },
    { value: "adoption-requests-received", label: "Requests Received", icon: Inbox },
]

type DashboardTabTriggerProps = {
    value: string;
    label: string;
    icon: React.ElementType;
    isActive: boolean;
    isMobile: boolean;
}

function DashboardTabTrigger({ value, label, icon: Icon, isActive, isMobile }: DashboardTabTriggerProps) {
    const showLabel = !isMobile || (isMobile && isActive);
    
    return (
        <TabsTrigger
            value={value}
            className={cn(
                "flex-1 md:flex-none md:flex-initial flex items-center gap-2 py-2.5 data-[state=active]:shadow-none transition-all duration-300",
                "data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary",
                 "text-muted-foreground"
            )}
        >
            <Icon className="h-5 w-5" />
            {showLabel && <span className="hidden sm:inline-block">{label}</span>}
             {isMobile && isActive && <span className="sm:hidden">{label}</span>}
        </TabsTrigger>
    )
}

type DashboardTabsProps = {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
    const isMobile = useIsMobile();
    return (
        <div className="sticky top-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40 py-2 -mt-2">
            <TabsList className="h-auto p-0 justify-between md:justify-center overflow-x-auto bg-transparent w-full border-b rounded-none">
                {tabInfo.map(tab => (
                    <DashboardTabTrigger 
                        key={tab.value}
                        value={tab.value}
                        label={tab.label}
                        icon={tab.icon}
                        isActive={activeTab === tab.value}
                        isMobile={isMobile}
                    />
                ))}
            </TabsList>
        </div>
    )
}
