
import type { AdoptionRequest } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { User, CheckCircle, XCircle, Clock } from 'lucide-react';

type AdoptionRequestsListProps = {
  requests: AdoptionRequest[] | null;
};

export function AdoptionRequestsList({ requests }: AdoptionRequestsListProps) {
  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 h-48 border rounded-lg">
        <User className="h-10 w-10 mb-4" />
        <p>No adoption requests have been submitted for this pet yet.</p>
      </div>
    );
  }

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

  const getStatusIcon = (status: string) => {
     switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 mr-2 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 mr-2 text-red-600" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 mr-2 text-yellow-600" />;
    }
  }

  return (
    <div className="border rounded-lg">
        <Table>
            <TableCaption>A list of adoption requests for this pet.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {requests.map((req) => (
                <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.requester_name}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(req.request_status)} className="capitalize flex items-center w-fit">
                           {getStatusIcon(req.request_status)} {req.request_status}
                        </Badge>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
