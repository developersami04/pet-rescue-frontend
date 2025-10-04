
'use client';

import { PetReport } from "@/lib/data";
import { FoundPetsSection } from "../found-pets-section";

type FoundPetsTabProps = {
  pets: PetReport[];
}

export function FoundPetsTab({ pets }: FoundPetsTabProps) {
  return <FoundPetsSection foundPets={pets} />;
}
