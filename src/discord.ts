import { Client, Events, GatewayIntentBits, Message, User } from "discord.js";

export class DiscordService {
    private client: Client;
    private ready: boolean = false;
    private replyCallback: (message: Message<boolean>) => AsyncGenerator<string, void, unknown>;

    constructor(_replyCallback: (message: Message<boolean>) => AsyncGenerator<string, void, unknown>) {
        this.replyCallback = _replyCallback;
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });

        this.setupEventHandlers();
    }

    public User(): User {
        return this.client.user!;
    }

    private setupEventHandlers(): void {
        this.client.on(Events.ClientReady, (readyClient) => {
            this.ready = true;
            console.log(`Discord bot logged in as ${readyClient.user.tag}!`);
        });

        this.client.on(Events.MessageCreate, async (message) => {
            if (message.author.id === this.client.user!.id) {
                return;
            }
            if (!message.mentions.has(this.client.user!)) {
                return;
            }

            try {

                const reply = this.replyCallback(message);

                // If already in a thread, reply there
                if (message.channel.isThread()) {
                    for await (const msg of reply) {
                        await message.channel.send(msg);
                    }
                } else if (message.inGuild()) {
                    const thread = await message.startThread({
                        name: `Chat with ${message.author.username}`,
                        autoArchiveDuration: 60,
                    });
                    for await (const msg of reply) {
                        await thread.send(msg);
                    }
                } else {
                    // Fallback to regular reply (DMs, etc.)
                    for await (const msg of reply) {
                        await message.channel.send(msg);
                    }
                }
            } catch (error) {
                console.error("Failed to process Discord message:", error);
            }
        });
    }

    async login(): Promise<void> {
        await this.client.login(process.env['DISCORD_BOT_TOKEN']);
    }

    isReady(): boolean {
        return this.ready;
    }
}
