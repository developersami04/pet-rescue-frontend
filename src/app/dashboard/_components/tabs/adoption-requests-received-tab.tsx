
'use client';

import { AdoptionRequest } from "@/lib/data";
import { AdoptionRequestsReceivedSection } from "../adoption-requests-received-section";

type AdoptionRequestsReceivedTabProps = {
  requests: AdoptionRequest[];
  onUpdate: () => void;
}

export function AdoptionRequestsReceivedTab({ requests, onUpdate }: AdoptionRequestsReceivedTabProps) {
  return <AdoptionRequestsReceivedSection requests={requests} onUpdate={onUpdate} />;
}
