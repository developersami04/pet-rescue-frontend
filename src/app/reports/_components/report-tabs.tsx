
'use client';

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AlertTriangle, Search, Hand } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const tabInfo = [
    { value: "lost", label: "Lost", icon: AlertTriangle },
    { value: "found", label: "Found", icon: Search },
    { value: "adopt", label: "Adoptable", icon: Hand },
];

type ReportTabsProps = {
    activeTab: string;
    onTabChange: (tab: string) => void;
};

export function ReportTabs({ activeTab, onTabChange }: ReportTabsProps) {
    const isMobile = useIsMobile();

    return (
        <div className="sticky top-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40 py-2 -mt-2">
            <TabsList className="h-auto p-1 justify-center bg-muted/50 w-full rounded-lg">
                {tabInfo.map((tab) => {
                    const isActive = activeTab === tab.value;
                    const showLabel = !isMobile || (isMobile && isActive);
                    return (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            onClick={() => onTabChange(tab.value)}
                            className={cn(
                                "flex-1 flex items-center gap-2 py-2 text-muted-foreground transition-all duration-300",
                                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
                            )}
                        >
                            <tab.icon className="h-5 w-5" />
                            {showLabel && <span className="hidden sm:inline-block">{tab.label}</span>}
                            {isMobile && isActive && <span className="sm:hidden">{tab.label}</span>}
                        </TabsTrigger>
                    );
                })}
            </TabsList>
        </div>
    );
}
