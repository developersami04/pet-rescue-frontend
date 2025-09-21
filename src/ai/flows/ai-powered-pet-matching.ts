// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview An AI-powered pet matching flow that suggests pets to users based on their lifestyle and preferences.
 *
 * - petMatching - A function that handles the pet matching process.
 * - PetMatchingInput - The input type for the petMatching function.
 * - PetMatchingOutput - The return type for the petMatching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PetMatchingInputSchema = z.object({
  lifestyle: z.string().describe('Description of the user\'s lifestyle, including living situation, activity level, and typical daily schedule.'),
  preferences: z.string().describe('The user\'s preferences for a pet, including desired breed, age, size, temperament, and any other relevant factors.'),
});
export type PetMatchingInput = z.infer<typeof PetMatchingInputSchema>;

const PetMatchingOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      petId: z.string().describe('The ID of the suggested pet.'),
      name: z.string().describe('The name of the suggested pet.'),
      breed: z.string().describe('The breed of the suggested pet.'),
      age: z.string().describe('The age of the suggested pet.'),
      description: z.string().describe('A short description of the suggested pet.'),
      imageUrl: z.string().describe('URL of the pet image.'),
      matchReason: z.string().describe('Explanation of why this pet is a good match for the user based on their lifestyle and preferences.'),
    })
  ).describe('A list of pet suggestions based on the user\'s lifestyle and preferences.'),
});
export type PetMatchingOutput = z.infer<typeof PetMatchingOutputSchema>;

export async function petMatching(input: PetMatchingInput): Promise<PetMatchingOutput> {
  return petMatchingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'petMatchingPrompt',
  input: {schema: PetMatchingInputSchema},
  output: {schema: PetMatchingOutputSchema},
  prompt: `You are an expert pet matching assistant. You will suggest pets to the user based on their lifestyle and preferences.

Lifestyle: {{{lifestyle}}}
Preferences: {{{preferences}}}

Consider the following when making your suggestions:
* The user's living situation (e.g., apartment, house with a yard).
* The user's activity level (e.g., sedentary, active).
* The user's typical daily schedule (e.g., works long hours, works from home).
* The user's preferences for a pet (e.g., breed, age, size, temperament).
* Match Reason should be one short sentence.

Suggest pets that are most likely to be a good fit for the user.  Provide at least three suggestions. Do not make up data, include the ID of the suggested pet.

Output your response as a JSON object that matches the following schema:
${JSON.stringify(PetMatchingOutputSchema.describe(''))}`,
});

const petMatchingFlow = ai.defineFlow(
  {
    name: 'petMatchingFlow',
    inputSchema: PetMatchingInputSchema,
    outputSchema: PetMatchingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
