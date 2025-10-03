
'use client';

import { MedicalHistory } from "@/lib/data";
import { FileText, Pill, Syringe } from "lucide-react";

function format(date: Date | string, formatStr: string) {
    const d = new Date(date);
    // Basic PPP format 'Month day, year'
    if (formatStr === 'PPP') {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(d);
    }
    return d.toLocaleDateString();
}


type MedicalHistoryCardProps = {
    history: MedicalHistory | null;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | null | undefined }) {
    if (!value) return null;
    return (
        <div className="flex items-start">
            <div className="flex-shrink-0 w-8 pt-1 text-center text-muted-foreground">{icon}</div>
            <div className="ml-3">
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-muted-foreground text-sm break-words">{value}</p>
            </div>
        </div>
    )
}

export function MedicalHistoryContent({ history }: MedicalHistoryCardProps) {
    if (!history) {
        return (
            <p className="text-muted-foreground text-sm">No medical history provided for this pet.</p>
        )
    }

    const lastVaccinated = history.last_vaccinated_date ? format(history.last_vaccinated_date, 'PPP') : 'N/A';

    const hasDiseaseInfo = history.disease_name || history.stage;
    const hasVaccineInfo = history.vaccination_name || history.last_vaccinated_date || history.no_of_years;
    const hasNotes = history.note;

    const noInfoAvailable = !hasDiseaseInfo && !hasVaccineInfo && !hasNotes;

    return (
        <div className="space-y-4 pt-2">
            {noInfoAvailable ? (
                <p className="text-muted-foreground text-sm">No specific medical information available.</p>
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
                            value={`${history.vaccination_name || 'N/A'} - Last on ${lastVaccinated}${history.no_of_years ? ` (${history.no_of_years} years ago)` : ''}`}
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
        </div>
    );
}
