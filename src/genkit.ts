import { googleAI } from '@genkit-ai/google-genai';
import { genkit, z, type DynamicResourceAction, type ToolAction, Document } from 'genkit';
import { createMcpHost } from '@genkit-ai/mcp';
import * as fs from 'fs/promises';
import * as path from 'path';

const ai = genkit({
    plugins: [googleAI()],
});

async function getToolsAndResources(): Promise<{ tools: Array<ToolAction>, resources: Array<DynamicResourceAction> }> {
    const host = createMcpHost(JSON.parse(await fs.readFile(path.join(process.cwd(), 'config/mcp-config.json'), 'utf-8')));
    const tools = await host.getActiveTools(ai);
    const resources = await host.getActiveResources(ai);

    return { tools, resources };
}
async function loadDocuments(): Promise<Document[]> {
    const documentsDir = path.join(process.cwd(), 'documents');
    let docs: Document[] = [];

    try {
        const files = await fs.readdir(documentsDir);
        docs = await Promise.all(
            files.map(async (file: string) => {
                const filePath = path.join(documentsDir, file);
                const stats = await fs.stat(filePath);
                if (stats.isFile()) {
                    const content = await fs.readFile(filePath, 'utf-8');
                    console.log("load document: ", file);
                    return Document.fromText(content, { fileName: file });
                }
                return null;
            })
        ).then((results: (Document | null)[]) => results.filter((d): d is Document => d !== null));
    } catch (error) {
        console.warn("Error reading documents folder:", error);
    }

    return docs;
}

export const petFlow = ai.defineFlow(
    {
        name: "petFlow",
        inputSchema: z.object({ prompt: z.string() }),
        outputSchema: z.string(),
    },
    async ({ prompt }) => {

        const { response } = ai.prompt('pet').stream({
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
    async (input, { sendChunk }) => {
        const { response, stream } = ai.prompt('discord').stream({
            botUserId: input.botUserId,
            prompt: input.prompt,
        }, {
            ... await getToolsAndResources(),
            toolChoice: 'auto',
            messages: input.messages,
            docs: await loadDocuments(),
        });
        for await (const chunk of stream) {
            if (chunk.reasoning) {
                sendChunk(chunk.reasoning);
            }
        }
        return (await response).text;
    },
);