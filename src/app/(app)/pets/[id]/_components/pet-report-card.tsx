
'use client';

import { PetReport } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { User, MessageCircle } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type PetReportContentProps = {
    report: PetReport | null;
}

export function PetReportContent({ report }: PetReportContentProps) {
    if (!report) return (
         <p className="text-muted-foreground text-sm">No report information available for this pet.</p>
    );

    const imageUrl = report.report_image;

    return (
        <div className="pt-2 space-y-6">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">Report Status: <span className="capitalize text-muted-foreground font-normal">{report.pet_status}</span></p>
                    <p className="text-sm font-semibold">Activity: <span className="capitalize text-muted-foreground font-normal">{report.report_status}</span></p>
                </div>
                 <Badge variant={report.is_resolved ? 'default' : 'secondary'}>
                    {report.is_resolved ? 'Resolved' : 'Active'}
                </Badge>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                         <MessageCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <div>
                             <p className="font-semibold text-sm">Reporter's Message</p>
                             <p className="text-muted-foreground text-sm">{report.message || "No message provided."}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                         <User className="h-5 w-5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <div>
                             <p className="font-semibold text-sm">Reported By</p>
                             <p className="text-muted-foreground text-sm">{report.reporter_name}</p>
                        </div>
                    </div>
                </div>
                {imageUrl && (
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                        <Image src={imageUrl} alt={`Report image for ${report.pet_name}`} fill className="object-cover" />
                    </div>
                )}
            </div>
        </div>
    );
}
