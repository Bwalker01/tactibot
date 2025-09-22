import { ChatInputCommandInteraction } from "discord.js";
import pingCommand from "../ping";

describe('ping', () => {
    it('should format the message correctly', async () => {
        const mockInteraction = {
            reply: jest.fn(),
            deferReply: jest.fn(),
            editReply: jest.fn(),
            client: {
                ws: {
                    ping: 0,
                },
            },
        } as unknown as ChatInputCommandInteraction;

        await pingCommand.execute(mockInteraction);

        expect(mockInteraction.reply).toHaveBeenCalledWith('Pong! ***0**ms*');
    })
});