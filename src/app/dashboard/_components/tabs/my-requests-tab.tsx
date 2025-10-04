
'use client';

import { MyAdoptionRequest } from "@/lib/data";
import { MyRequestsSection } from "../my-requests-section";

type MyRequestsTabProps = {
  requests: MyAdoptionRequest[];
  onUpdate: () => void;
}

export function MyRequestsTab({ requests, onUpdate }: MyRequestsTabProps) {
  return <MyRequestsSection requests={requests} onUpdate={onUpdate} />;
}
