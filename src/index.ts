import 'dotenv/config';
import { constructHistoryMessage, constructUserPrompt, DiscordService } from './discord.js';
import { discordFlow } from './genkit.js';

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

            let content = "";
            for await (const chunk of resp.stream) {
                content += chunk;
                yield content;
            }
            yield await resp.output;
        });
        await discordService.login();
    } catch (error) {
        console.error("Failed to start application:", error);
        process.exit(1);
    }
}

main().catch(console.error);