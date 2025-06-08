'use server';

/**
 * @fileOverview An AI agent that analyzes a user's vibe based on their quiz responses.
 *
 * - analyzeVibe - A function that analyzes the user's vibe and provides feedback.
 * - AnalyzeVibeInput - The input type for the analyzeVibe function.
 * - AnalyzeVibeOutput - The return type for the analyzeVibe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeVibeInputSchema = z.object({
  responses: z
    .array(z.string())
    .describe('An array of the user responses to the vibe check quiz.'),
});
export type AnalyzeVibeInput = z.infer<typeof AnalyzeVibeInputSchema>;

const AnalyzeVibeOutputSchema = z.object({
  vibeAnalysis: z
    .string()
    .describe(
      'A detailed analysis of the users vibe, compared to general trends and popular opinions.'
    ),
});
export type AnalyzeVibeOutput = z.infer<typeof AnalyzeVibeOutputSchema>;

export async function analyzeVibe(input: AnalyzeVibeInput): Promise<AnalyzeVibeOutput> {
  return analyzeVibeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVibePrompt',
  input: {schema: AnalyzeVibeInputSchema},
  output: {schema: AnalyzeVibeOutputSchema},
  prompt: `You are a vibe analyst, skilled in comparing peoples opinions to those of the general public.

You will receive a series of responses from a user answering a vibe check quiz. You will respond with a detailed analysis of their vibe and how it compares to current trends and general opinions.

Responses: {{{responses}}}

Analyze the users vibe:`,
});

const analyzeVibeFlow = ai.defineFlow(
  {
    name: 'analyzeVibeFlow',
    inputSchema: AnalyzeVibeInputSchema,
    outputSchema: AnalyzeVibeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
