
'use client';

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PawPrint, AlertTriangle, Search, Hand, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const tabInfo = [
    { value: "my-pets", label: "My Pets", icon: PawPrint },
    { value: "lost-pets", label: "Lost Pets", icon: AlertTriangle },
    { value: "found-pets", label: "Found Pets", icon: Search },
    { value: "adoptable-pets", label: "Adoptable", icon: Hand },
    { value: "my-requests", label: "My Requests", icon: FileText },
]

type DashboardTabTriggerProps = {
    value: string;
    label: string;
    icon: React.ElementType;
    isActive: boolean;
    isMobile: boolean;
}

function DashboardTabTrigger({ value, label, icon: Icon, isActive, isMobile }: DashboardTabTriggerProps) {
    return (
        <TabsTrigger
            value={value}
            className={cn(
                "flex-1 md:flex-none md:flex-initial flex items-center gap-2 py-2.5 data-[state=active]:shadow-none",
                isActive ? "bg-primary/10 text-primary border-primary" : "text-muted-foreground"
            )}
        >
            <Icon className="h-5 w-5" />
            {!isMobile && label}
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
        <div className="sticky top-16 bg-background z-40 py-2 -mt-2">
            <TabsList className="h-auto p-1.5 justify-start md:justify-center overflow-x-auto bg-muted/60">
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
