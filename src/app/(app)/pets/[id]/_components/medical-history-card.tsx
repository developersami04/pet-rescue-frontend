
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MedicalHistory } from "@/lib/data";
import { FileText, Pill, Syringe } from "lucide-react";
import { format, parseISO } from 'date-fns';

type MedicalHistoryCardProps = {
    history: MedicalHistory | null;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | null | undefined }) {
    if (!value) return null;
    return (
        <div className="flex items-start">
            <div className="flex-shrink-0 w-8 text-center">{icon}</div>
            <div className="ml-3">
                <p className="font-semibold">{label}</p>
                <p className="text-muted-foreground">{value}</p>
            </div>
        </div>
    )
}

export function MedicalHistoryCard({ history }: MedicalHistoryCardProps) {
    if (!history) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Medical History</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No medical history provided for this pet.</p>
                </CardContent>
            </Card>
        )
    }

    const lastVaccinated = history.last_vaccinated_date ? format(parseISO(history.last_vaccinated_date), 'PPP') : 'N/A';

    const hasDiseaseInfo = history.disease_name || history.stage;
    const hasVaccineInfo = history.vaccination_name || history.last_vaccinated_date || history.no_of_years;
    const hasNotes = history.note;

    const noInfoAvailable = !hasDiseaseInfo && !hasVaccineInfo && !hasNotes;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Medical History</CardTitle>
                <CardDescription>All available medical information for this pet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {noInfoAvailable ? (
                    <p className="text-muted-foreground">No specific medical information available.</p>
                ) : (
                    <>
                        {hasDiseaseInfo && (
                             <InfoRow
                                icon={<Pill className="h-5 w-5 text-destructive" />}
                                label="Disease Information"
                                value={`${history.disease_name || 'Not specified'}${history.stage ? ` (Stage: ${history.stage})` : ''}`}
                            />
                        )}
                        {hasVaccineInfo && (
                            <InfoRow
                                icon={<Syringe className="h-5 w-5 text-primary" />}
                                label="Vaccination Information"
                                value={`${history.vaccination_name || 'N/A'} - Last on ${lastVaccinated} (${history.no_of_years || 'N/A'} years ago)`}
                            />
                        )}

                        {hasNotes && (
                             <InfoRow
                                icon={<FileText className="h-5 w-5 text-muted-foreground" />}
                                label="Additional Notes"
                                value={history.note}
                            />
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
