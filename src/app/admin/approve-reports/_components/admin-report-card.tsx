
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { AdminPetReport } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, Loader2, MoreVertical, ShieldCheck, ThumbsDown, X } from 'lucide-react';

type ReportStatus = 'approved' | 'rejected' | 'resolved';

type AdminReportCardProps = {
  report: AdminPetReport;
  onUpdate: (reportId: number, status: ReportStatus) => void;
  isUpdating: boolean;
};

export function AdminReportCard({ report, onUpdate, isUpdating }: AdminReportCardProps) {
  const imageUrl = report.image || `https://picsum.photos/seed/${report.pet_id}/400/300`;
  const petStatus = report.pet_status;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <Link href={`/pets/${report.pet_id}`} className="group">
            <div className="relative h-56 w-full">
            <Image
                src={imageUrl}
                alt={report.pet_name}
                fill
                className="object-cover"
                data-ai-hint={report.pet_type_name}
            />
            {petStatus && (
                <Badge 
                className={cn("absolute bottom-2 left-2 capitalize", 
                    petStatus === 'lost' ? 'bg-destructive/90 text-destructive-foreground' : 
                    petStatus === 'found' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                )}
                >
                    {petStatus}
                </Badge>
            )}
             <Badge 
                className={cn("absolute bottom-2 right-2 capitalize", 
                    report.report_status === 'pending' ? 'bg-amber-500 text-white' : 
                    report.report_status === 'approved' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                )}
                >
                    {report.report_status}
                </Badge>
            </div>
      </Link>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="font-headline tracking-wide flex items-center gap-2">
                <Link href={`/pets/${report.pet_id}`} className="hover:underline">
                    {report.pet_name}
                </Link>
            </CardTitle>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onUpdate(report.id, 'approved')} disabled={report.report_status === 'approved'}>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <span>Approve</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => onUpdate(report.id, 'rejected')} disabled={report.report_status === 'rejected'}>
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        <span>Reject</span>
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onUpdate(report.id, 'resolved')}>
                        <Check className="mr-2 h-4 w-4" />
                        <span>Resolve</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {report.pet_type_name}
        </p>
         <p className="text-sm text-muted-foreground mt-1">
          Reported by: {report.created_by_username || 'N/A'}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 !p-4">
        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => onUpdate(report.id, 'approved')} disabled={isUpdating || report.report_status === 'approved'}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <ShieldCheck className="mr-2 h-4 w-4" /> Approve
        </Button>
        <div className="flex w-full gap-2">
             <Button variant="destructive" className="w-full" onClick={() => onUpdate(report.id, 'rejected')} disabled={isUpdating || report.report_status === 'rejected'}>
                <ThumbsDown className="mr-2 h-4 w-4" /> Reject
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => onUpdate(report.id, 'resolved')} disabled={isUpdating}>
                <X className="mr-2 h-4 w-4" /> Resolve
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
