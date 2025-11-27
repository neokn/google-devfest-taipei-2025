import { googleAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

const ai = genkit({
    plugins: [googleAI()],
});

export const patFlow = ai.defineFlow(
    {
        name: "patFlow",
        inputSchema: z.object({ prompt: z.string() }),
        outputSchema: z.string(),
    },
    async ({ prompt }) => {

        const { response } = ai.prompt('cat').stream({
            prompt: prompt,
        });

        return (await response).text;
    },
);
