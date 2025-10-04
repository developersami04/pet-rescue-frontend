
'use client';

import { PetReport } from "@/lib/data";
import { LostPetsSection } from "../lost-pets-section";

type LostPetsTabProps = {
  pets: PetReport[];
}

export function LostPetsTab({ pets }: LostPetsTabProps) {
  return <LostPetsSection lostPets={pets} />;
}
