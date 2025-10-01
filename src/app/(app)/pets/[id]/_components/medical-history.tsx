
import type { MedicalHistory } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Stethoscope, ShieldCheck } from 'lucide-react';
import { format, parseISO } from 'date-fns';

type MedicalHistoryProps = {
  medicalHistory: MedicalHistory | null;
};

export function MedicalHistory({ medicalHistory }: MedicalHistoryProps) {
  const hasRecords = medicalHistory && (medicalHistory.vaccination_name || medicalHistory.disease_name || medicalHistory.last_vaccinated_date || medicalHistory.note);

  if (!hasRecords) {
    return (
       <div className="flex flex-col items-center justify-center text-center text-green-600 dark:text-green-500 p-8 h-48 border rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <ShieldCheck className="h-10 w-10 mb-4" />
        <p className="font-semibold">This pet is healthy and has no recorded medical issues.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
        <Card key={medicalHistory.id}>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              {medicalHistory.vaccination_name || medicalHistory.disease_name || 'Medical Record'}
            </CardTitle>
            {medicalHistory.disease_name && medicalHistory.vaccination_name && (
                <CardDescription>{medicalHistory.disease_name}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {medicalHistory.last_vaccinated_date && (
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Vaccinated:</span>
                    <span className="font-medium">{format(parseISO(medicalHistory.last_vaccinated_date), 'PPP')}</span>
                </div>
            )}
            {medicalHistory.stage && (
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Stage:</span>
                    <span className="font-medium">{medicalHistory.stage}</span>
                </div>
            )}
             {medicalHistory.no_of_years !== null && (
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Years Since:</span>
                    <span className="font-medium">{medicalHistory.no_of_years}</span>
                </div>
             )}
            {medicalHistory.note && (
                <div>
                    <span className="text-muted-foreground">Notes:</span>
                    <p className="font-medium bg-muted/50 p-2 rounded-md mt-1">{medicalHistory.note}</p>
                </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
