
'use client';

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Clock, History, ThumbsDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const tabInfo = [
    { value: "pending", label: "Pending Requests", icon: Clock },
    { value: "last50", label: "Last 50 Requests", icon: History },
    { value: "rejected", label: "Rejected Requests", icon: ThumbsDown },
];

type AdoptionRequestsTabsProps = {
    activeTab: string;
    onTabChange: (tab: 'pending' | 'last50' | 'rejected') => void;
};

export function AdoptionRequestsTabs({ activeTab, onTabChange }: AdoptionRequestsTabsProps) {
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
                            onClick={() => onTabChange(tab.value as any)}
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
