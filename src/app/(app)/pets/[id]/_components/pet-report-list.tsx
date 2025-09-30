
import type { PetReport } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Flag } from 'lucide-react';
import { format, parseISO } from 'date-fns';

type PetReportListProps = {
  reports: PetReport[];
};

export function PetReportList({ reports }: PetReportListProps) {
  if (!reports || reports.length === 0) {
    return (
       <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 h-48 border rounded-lg">
        <Flag className="h-10 w-10 mb-4" />
        <p>There are no reports for this pet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id}>
          <CardHeader>
            <CardTitle className="text-xl capitalize flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                     {report.pet_status} Pet Report
                </div>
                 <Badge variant={report.is_resolved ? 'default' : 'destructive'} className="capitalize">
                    {report.is_resolved ? 'Resolved' : 'Active'}
                 </Badge>
            </CardTitle>
            <CardDescription>
                Reported by {report.reporter_name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {report.message && <p className="bg-muted/50 p-3 rounded-md">{report.message}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
