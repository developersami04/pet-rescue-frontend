
import type { MedicalHistory } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Stethoscope, ShieldCheck } from 'lucide-react';
import { format, parseISO } from 'date-fns';

type MedicalHistoryListProps = {
  history: MedicalHistory[] | null;
};

export function MedicalHistoryList({ history }: MedicalHistoryListProps) {
  if (!history || history.length === 0) {
    return (
       <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 h-48 border rounded-lg">
        <Stethoscope className="h-10 w-10 mb-4" />
        <p>No medical history records are available for this pet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((record) => (
        <Card key={record.id}>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              {record.vaccination_name}
            </CardTitle>
            <CardDescription>{record.disease_name}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {record.last_vaccinated_date && (
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Vaccinated:</span>
                    <span className="font-medium">{format(parseISO(record.last_vaccinated_date), 'PPP')}</span>
                </div>
            )}
            <div className="flex justify-between">
                <span className="text-muted-foreground">Stage:</span>
                <span className="font-medium">{record.stage}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Years Since:</span>
                <span className="font-medium">{record.no_of_years}</span>
            </div>
            {record.message && (
                <div>
                    <span className="text-muted-foreground">Notes:</span>
                    <p className="font-medium bg-muted/50 p-2 rounded-md mt-1">{record.message}</p>
                </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
