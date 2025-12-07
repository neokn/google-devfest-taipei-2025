import 'dotenv/config';
import { constructHistoryMessage, constructUserPrompt, DiscordService } from './discord.js';
import { discordFlow, petFlow } from './genkit.js';
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { expressHandler } from '@genkit-ai/express';
import express from 'express';

async function main() {
    try {
        const discordService = new DiscordService(async function* (message, root, history) {
            const userId = discordService.User().id;

            const historyMessages = constructHistoryMessage(userId, root, history);

            const userPrompt = constructUserPrompt(message, historyMessages);

            const resp = discordFlow.stream({
                botUserId: discordService.User().id,
                prompt: userPrompt.content.map((c) => `${c.text}`),
                messages: historyMessages,
            });
            yield await resp.output;
        });
        await discordService.login();
        const app = express();
        app.use(express.json());

        app.post('/petFlow', expressHandler(petFlow));

        app.listen(8080, () => {
            console.log('Express server listening on port 8080');
        });
    } catch (error) {
        console.error("Failed to start application:", error);
        process.exit(1);
    }
}

main().catch(console.error);