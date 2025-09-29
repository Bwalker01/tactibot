import { ChatInputCommandInteraction } from 'discord.js';
import pingCommand from '../ping';
import { mockInteractionBasics } from '../../../utils/testUtils';

describe('ping', () => {
	it('should format the message correctly', async () => {
		const mockInteraction = {
			...mockInteractionBasics,
			client: {
				ws: {
					ping: 0,
				},
			},
		} as unknown as ChatInputCommandInteraction;

		await pingCommand.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith('Pong! ***0**ms*');
	});

	it('should give the correct ping', async () => {
		const mockInteraction = {
			reply: jest.fn(),
			deferReply: jest.fn(),
			editReply: jest.fn(),
			client: {
				ws: {
					ping: 100,
				},
			},
		} as unknown as ChatInputCommandInteraction;

		await pingCommand.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith(expect.stringContaining('100'));
	});
});
