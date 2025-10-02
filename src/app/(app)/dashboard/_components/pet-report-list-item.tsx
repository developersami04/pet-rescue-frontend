

'use client';

import { Card } from "@/components/ui/card";
import { PetReport } from "@/lib/data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";


type PetReportListItemProps = {
    report: PetReport;
}

export function PetReportListItem({ report }: PetReportListItemProps) {
    const imageUrl = report.report_image ?? `https://picsum.photos/seed/${report.pet}/100/100`;

    return (
        <Card className="p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/50">
            <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                    src={imageUrl}
                    alt={report.pet_name}
                    fill
                    className="object-cover rounded-md"
                    data-ai-hint={'pet report'}
                />
            </div>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <div className="md:col-span-2">
                    <h3 className="text-lg font-bold">{report.pet_name}</h3>
                    <p className="text-sm text-muted-foreground">Report Status: {report.report_status}</p>
                </div>
                <div className="flex justify-start md:justify-center">
                    <Badge 
                        className={cn("capitalize whitespace-nowrap", 
                            report.pet_status === 'lost' ? 'bg-destructive/90 text-destructive-foreground' : 'bg-blue-500 text-white'
                        )}
                        >
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            {report.pet_status}
                    </Badge>
                </div>
                 <div className="flex justify-start md:justify-end">
                     <Badge variant={report.is_resolved ? 'default' : 'secondary'} className="capitalize whitespace-nowrap">
                        {report.is_resolved ? 'Resolved' : 'Active'}
                    </Badge>
                </div>
            </div>
        </Card>
    )
}
