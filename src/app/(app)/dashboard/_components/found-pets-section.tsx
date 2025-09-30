
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

export function FoundPetsSection() {
    return (
        <Card className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 h-64 border-dashed">
            <Search className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">No Found Pets Reported</h3>
            <p className="mt-2">This section will show pets that have been reported as found.</p>
        </Card>
    );
}
