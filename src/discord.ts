import { Client, Events, GatewayIntentBits, Message, User, Collection } from "discord.js";

export function constructUserPrompt(message: Message<boolean>, historyMessages: Array<{ role: "model" | "user", content: Array<{ text: string }> }> = []): { role: "user", content: Array<{ text: string }> } {
    let userPrompt: { role: "user", content: Array<{ text: string }> } = {
        role: 'user' as const,
        content: []
    };

    if (historyMessages[historyMessages.length - 1]?.role === 'user') {
        userPrompt = historyMessages.pop()! as { role: "user", content: Array<{ text: string }> };
        userPrompt.content.push({ text: `${message.author.id}@${message.createdTimestamp}: ${message.content}  \n` });
    } else {
        userPrompt.content.push({ text: `${message.author.id}@${message.createdTimestamp}: ${message.content}  \n` });
    }

    return userPrompt;
}

export function constructHistoryMessage(userId: string, root?: Message<boolean>, history?: Array<Message<boolean>>): Array<{ role: "model" | "user", content: Array<{ text: string }> }> {

    const historyMessages: Array<{ role: "model" | "user", content: Array<{ text: string }> }> = history?.map((m) => {
        if (m.author.id === userId) {
            return {
                role: 'model' as const,
                content: [{ text: `${m.content}` }]
            };
        } else {
            return {
                role: 'user' as const,
                content: [{ text: `${m.author.id}@${m.createdTimestamp}: ${m.content}  \n` }]
            };
        }
    }).reduce((acc, curr) => {
        const last = acc[acc.length - 1];
        if (last && last.role === curr.role) {
            last.content.push(curr.content[0]!);
        } else {
            acc.push(curr);
        }
        return acc;
    }, [] as Array<{ role: "model" | "user", content: Array<{ text: string }> }>) ?? [];
    if (root) {
        historyMessages.unshift({
            role: 'user' as const,
            content: [{ text: `${root.author.id}@${root.createdTimestamp}: ${root.content}  \n` }]
        });
    }
    return historyMessages;
}

export class DiscordService {
    private client: Client;
    private ready: boolean = false;
    private replyCallback: (message: Message<boolean>, root?: Message<boolean>, history?: Array<Message<boolean>>) => AsyncGenerator<string, void, unknown>;

    constructor(_replyCallback: (message: Message<boolean>, root?: Message<boolean>, history?: Array<Message<boolean>>) => AsyncGenerator<string, void, unknown>) {
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

                let history: Collection<string, Message<boolean>> | undefined = undefined;
                let root: Message<boolean> | undefined = undefined;
                if (message.channel.isThread()) {
                    history = await message.channel.messages.fetch({
                        before: message.id,
                    });
                    root = await message.channel.messages.fetch(history.last()!.reference!.messageId!);
                }

                // If already in a thread, reply there
                if (message.channel.isThread()) {
                    const sentMessage = await message.channel.send("thinking...");
                    const reply = this.replyCallback(message, root, history?.map((m) => m));
                    for await (const chunk of reply) {
                        await sentMessage.edit(chunk);
                    }
                } else if (message.inGuild()) {
                    const thread = await message.startThread({
                        name: `Chat with ${message.author.username}`,
                        autoArchiveDuration: 60,
                    });
                    const sentMessage = await thread.send("thinking...");
                    const reply = this.replyCallback(message, root, history?.map((m) => m));
                    for await (const chunk of reply) {
                        await sentMessage.edit(chunk);
                    }
                } else {
                    // Fallback to regular reply (DMs, etc.)
                    const sentMessage = await message.channel.send("thinking...");
                    const reply = this.replyCallback(message, root, history?.map((m) => m));
                    for await (const chunk of reply) {
                        await sentMessage.edit(chunk);
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
