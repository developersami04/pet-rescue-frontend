
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdoptionRequest } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { getRandomDefaultProfileImage } from "@/lib/page-data/user-data";

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
                        ? `${requests.length} request(s) have been made for this pet.`
                        : "There are no adoption requests for this pet yet."
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {requests.map((request) => {
                    const defaultImage = getRandomDefaultProfileImage(request.requester_name);
                    return (
                        <div key={request.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={request.requester_profile_image || defaultImage} alt={request.requester_name} />
                                    <AvatarFallback>{request.requester_name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{request.requester_name}</p>
                                    <p className="text-sm text-muted-foreground truncate max-w-xs" title={request.message}>"{request.message}"</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={getStatusVariant(request.status)} className="capitalize">{request.status}</Badge>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    );
}
