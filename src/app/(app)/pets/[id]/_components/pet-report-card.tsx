
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PetReport } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, User, MessageCircle } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type PetReportCardProps = {
    report: PetReport | null;
}

export function PetReportCard({ report }: PetReportCardProps) {
    if (!report) return null;

    const imageUrl = report.report_image;

    return (
        <Card className={cn("border-l-4", report.pet_status === 'lost' ? 'border-destructive' : 'border-blue-500')}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                             <AlertTriangle className={cn(report.pet_status === 'lost' ? 'text-destructive' : 'text-blue-500')} />
                            Pet Report: <span className="capitalize">{report.pet_status}</span>
                        </CardTitle>
                        <CardDescription>
                            This pet was reported by {report.reporter_name}.
                        </CardDescription>
                    </div>
                    <Badge variant={report.is_resolved ? 'default' : 'secondary'}>
                        {report.is_resolved ? 'Resolved' : 'Active'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <div className="flex items-start gap-3">
                         <MessageCircle className="h-5 w-5 mt-1 flex-shrink-0 text-muted-foreground" />
                        <div>
                             <p className="font-semibold">Reporter's Message</p>
                             <p className="text-muted-foreground">{report.message || "No message provided."}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                         <User className="h-5 w-5 mt-1 flex-shrink-0 text-muted-foreground" />
                        <div>
                             <p className="font-semibold">Reported By</p>
                             <p className="text-muted-foreground">{report.reporter_name}</p>
                        </div>
                    </div>
                </div>
                {imageUrl && (
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                        <Image src={imageUrl} alt={`Report image for ${report.pet_name}`} fill className="object-cover" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

