
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdoptionRequest } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type AdoptionRequestsCardProps = {
    requests: AdoptionRequest[];
    petName: string;
};

export function AdoptionRequestsCard({ requests, petName }: AdoptionRequestsCardProps) {

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'default';
            case 'rejected':
                return 'destructive';
            case 'pending':
            default:
                return 'secondary';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Adoption Requests for {petName}</CardTitle>
                <CardDescription>
                    {requests.length > 0
                        ? `You have ${requests.length} pending request(s).`
                        : "There are no pending adoption requests for this pet."
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {requests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={`https://picsum.photos/seed/${request.requester_name}/100`} alt={request.requester_name} />
                                <AvatarFallback>{request.requester_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{request.requester_name}</p>
                                <p className="text-sm text-muted-foreground truncate max-w-xs">"{request.message}"</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-2">
                             {request.status === 'pending' ? (
                                <>
                                    <Button size="icon" variant="outline" className="h-8 w-8 bg-green-100 text-green-700 hover:bg-green-200">
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="outline" className="h-8 w-8 bg-red-100 text-red-700 hover:bg-red-200">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </>
                             ) : (
                                 <Badge variant={getStatusVariant(request.status)} className="capitalize">{request.status}</Badge>
                             )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
