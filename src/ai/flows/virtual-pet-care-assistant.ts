'use server';
/**
 * @fileOverview Virtual Pet Care Assistant flow.
 *
 * This file contains the Genkit flow for generating personalized care tips and schedules for pets.
 * - virtualPetCareAssistant - A function that generates personalized care tips and schedules based on pet profile.
 * - VirtualPetCareAssistantInput - The input type for the virtualPetCareAssistant function.
 * - VirtualPetCareAssistantOutput - The return type for the virtualPetCareAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VirtualPetCareAssistantInputSchema = z.object({
  petType: z.string().describe('The type of pet (e.g., dog, cat, bird).'),
  petAge: z.number().describe('The age of the pet in years.'),
  petBreed: z.string().describe('The breed of the pet (e.g., Labrador, Siamese).'),
  ownerLifestyle: z.string().describe('Description of the owner lifestyle (e.g., active, busy, relaxed).'),
  specificNeeds: z.string().optional().describe('Any specific needs or health conditions of the pet.'),
});
export type VirtualPetCareAssistantInput = z.infer<typeof VirtualPetCareAssistantInputSchema>;

const VirtualPetCareAssistantOutputSchema = z.object({
  careTips: z.string().describe('Personalized care tips for the pet.'),
  feedingSchedule: z.string().describe('Recommended feeding schedule for the pet.'),
  exerciseSchedule: z.string().describe('Recommended exercise schedule for the pet.'),
  groomingSchedule: z.string().describe('Recommended grooming schedule for the pet.'),
  healthTips: z.string().describe('Important health tips and reminders for the pet.'),
});
export type VirtualPetCareAssistantOutput = z.infer<typeof VirtualPetCareAssistantOutputSchema>;

export async function virtualPetCareAssistant(input: VirtualPetCareAssistantInput): Promise<VirtualPetCareAssistantOutput> {
  return virtualPetCareAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'virtualPetCareAssistantPrompt',
  input: {schema: VirtualPetCareAssistantInputSchema},
  output: {schema: VirtualPetCareAssistantOutputSchema},
  prompt: `You are a virtual pet care assistant. You provide personalized care tips and schedules for pets based on their profile and the owner's lifestyle.\n\nPet Type: {{{petType}}}\nPet Age: {{{petAge}}}\nPet Breed: {{{petBreed}}}\nOwner Lifestyle: {{{ownerLifestyle}}}\nSpecific Needs: {{{specificNeeds}}}\n\nGenerate personalized care tips, a feeding schedule, an exercise schedule, a grooming schedule, and important health tips for this pet. The response should be thorough and detailed. Return the schedules as bullet points.
`,
});

const virtualPetCareAssistantFlow = ai.defineFlow(
  {
    name: 'virtualPetCareAssistantFlow',
    inputSchema: VirtualPetCareAssistantInputSchema,
    outputSchema: VirtualPetCareAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
