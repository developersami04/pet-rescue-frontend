
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function LostPetsSection() {
    return (
        <Card className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 h-64 border-dashed">
            <AlertTriangle className="h-12 w-12 mb-4 text-destructive" />
            <h3 className="text-xl font-semibold">No Lost Pets Reported</h3>
            <p className="mt-2">This section will show pets that you have reported as lost.</p>
        </Card>
    );
}
