
'use client';

import { FavoritePet } from "@/lib/data";
import { FavoritesSection } from "../favorites-section";

type FavoritesTabProps = {
  favoritePets: FavoritePet[];
  onUpdate: () => void;
}

export function FavoritesTab({ favoritePets, onUpdate }: FavoritesTabProps) {
  return <FavoritesSection favoritePets={favoritePets} onUpdate={onUpdate} />;
}
