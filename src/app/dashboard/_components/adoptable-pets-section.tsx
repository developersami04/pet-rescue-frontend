
'use client';

import { Card } from "@/components/ui/card";
import { Hand, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { PetReport } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PetReportListItem } from "./pet-report-list-item";

type AdoptablePetsSectionProps = {
    adoptablePets: PetReport[];
}

export function AdoptablePetsSection({ adoptablePets }: AdoptablePetsSectionProps) {
    const [view, setView] = useState('grid');

    if (adoptablePets.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 h-64 border-dashed">
                <Hand className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold">No Pets Available for Adoption</h3>
                <p className="mt-2">Check back later to find new pets looking for a home.</p>
            </Card>
        );
    }
    
    return (
        <>
             <div className="flex items-center justify-end mb-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant={view === 'grid' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => setView('grid')}
                        aria-label="Grid view"
                    >
                        <LayoutGrid className="h-5 w-5" />
                    </Button>
                    <Button
                        variant={view === 'list' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => setView('list')}
                        aria-label="List view"
                    >
                        <List className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            {view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {adoptablePets.map(report => {
                        const imageUrl = report.report_image || `https://picsum.photos/seed/${report.pet}/300/300`;
                        return (
                            <Card key={report.id} className="overflow-hidden flex flex-col">
                                <Link href={`/pets/${report.pet}`} className="group">
                                    <div className="relative aspect-square w-full">
                                        <Image
                                            src={imageUrl}
                                            alt={report.pet_name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            data-ai-hint={'adoptable pet'}
                                        />
                                        <Badge 
                                            className={cn("absolute bottom-2 right-2 capitalize bg-green-500 text-white")}
                                        >
                                            Adoptable
                                        </Badge>
                                    </div>
                                </Link>
                                <div className="p-4 flex-grow">
                                    <div className="flex justify-between items-start">
                                         <Link href={`/pets/${report.pet}`} className="hover:underline">
                                            <h3 className="text-lg font-bold">{report.pet_name}</h3>
                                        </Link>
                                        <Badge variant={report.is_resolved ? 'default' : 'secondary'} className="capitalize whitespace-nowrap">
                                            {report.is_resolved ? 'Adopted' : 'Available'}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground pt-1">Status: {report.report_status}</p>
                                    
                                </div>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                 <div className="space-y-4">
                    {adoptablePets.map(report => (
                        <PetReportListItem key={report.id} report={report} />
                    ))}
                </div>
            )}
        </>
    );
}
