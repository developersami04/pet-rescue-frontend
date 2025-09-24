'use client';

import { useFormState } from 'react-dom';
import { petMatching as petMatchingFlow } from '@/ai/flows/ai-powered-pet-matching';
import { PetMatchingForm } from './pet-matching-form';
import { PetMatchingResults } from './pet-matching-results';

type PetSuggestion = {
  petId: string;
  name: string;
  breed: string;
  age: string;
  description: string;
  imageUrl: string;
  matchReason: string;
};

type PetMatchingState = {
  suggestions?: PetSuggestion[];
  error?: string;
};

const initialState: PetMatchingState = {};

export function PetMatching() {
  const [state, formAction] = useFormState(
    async (
      prevState: PetMatchingState,
      formData: FormData
    ): Promise<PetMatchingState> => {
      const lifestyle = formData.get('lifestyle') as string;
      const preferences = formData.get('preferences') as string;

      // Basic validation
      if (!lifestyle || lifestyle.length < 10 || !preferences || preferences.length < 10) {
        // This is a simple validation. A more robust solution would be to handle this in the form component.
        // For now, we don't return an error message to keep the UI clean, but the form's own validation will handle user feedback.
        return {};
      }

      try {
        const result = await petMatchingFlow({ lifestyle, preferences });
        return result;
      } catch (e: any) {
        return { error: e.message || 'An unknown error occurred.' };
      }
    },
    initialState
  );

  return (
    <div>
      <PetMatchingForm formAction={formAction} />
      <PetMatchingResults state={state} />
    </div>
  );
}
