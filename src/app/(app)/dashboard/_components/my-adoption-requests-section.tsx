
'use client';

import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function MyAdoptionRequestsSection() {
    return (
        <Card className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 h-64 border-dashed">
            <FileText className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">No Adoption Requests Made</h3>
            <p className="mt-2">This section will show the status of adoption requests you have submitted.</p>
        </Card>
    );
}
