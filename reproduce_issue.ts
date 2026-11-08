
import { genkit } from 'genkit';
import { createMcpHost } from '@genkit-ai/mcp';
import * as fs from 'fs/promises';
import * as path from 'path';

async function run() {
    const ai = genkit({});
    try {
        const configPath = path.join(process.cwd(), 'config/mcp-config.json');
        const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
        console.log("Config:", config);

        const host = createMcpHost(config);
        console.log("Fetching tools...");
        const tools = await host.getActiveTools(ai);
        console.log("Tools fetched:", tools.map(t => t.name));

        for (const tool of tools) {
            console.log(`Tool: ${tool.name}`);
            console.log("Input Schema:", JSON.stringify(tool.__action.inputSchema, null, 2));
        }

    } catch (e) {
        console.error("Caught error:", e);
    }
}

run();
