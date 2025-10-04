
'use client';

import { PetReport } from "@/lib/data";
import { AdoptablePetsSection } from "../adoptable-pets-section";

type AdoptablePetsTabProps = {
  pets: PetReport[];
}

export function AdoptablePetsTab({ pets }: AdoptablePetsTabProps) {
  return <AdoptablePetsSection adoptablePets={pets} />;
}
