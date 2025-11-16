import 'dotenv/config';
import { DiscordService } from './discord.js';
import { petFlow } from './genkit.js';

async function main() {
    try {
        const discordService = new DiscordService(async function* (message) {
            const resp = petFlow.stream({
                prompt: message.content,
            });

            yield await resp.output;
        });
        await discordService.login();
    } catch (error) {
        console.error("Failed to start application:", error);
        process.exit(1);
    }
}

main().catch(console.error);