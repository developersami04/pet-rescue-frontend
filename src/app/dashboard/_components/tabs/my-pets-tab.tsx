
'use client';

import { Pet } from "@/lib/data";
import { MyPetsSection } from "../my-pets-section";

type MyPetsTabProps = {
  pets: Pet[];
}

export function MyPetsTab({ pets }: MyPetsTabProps) {
  return <MyPetsSection myPets={pets} />;
}
