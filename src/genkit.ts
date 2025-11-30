import { googleAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

const ai = genkit({
    plugins: [googleAI()],
});

export const petFlow = ai.defineFlow(
    {
        name: "petFlow",
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

export const discordFlow = ai.defineFlow(
    {
        name: "discordFlow",
        inputSchema: z.object({
            botUserId: z.string(),
            prompt: z.array(z.string()),
            messages: z.array(z.object({
                role: z.union([z.literal("model"), z.literal("user")]),
                content: z.array(z.object({
                    text: z.string(),
                })),
            }))
        }),
        outputSchema: z.string(),
    },
    async (input) => {
        const { response } = ai.prompt('discord').stream({
            botUserId: input.botUserId,
            prompt: input.prompt,
        }, {
            messages: input.messages
        });
        return (await response).text;
    },
);