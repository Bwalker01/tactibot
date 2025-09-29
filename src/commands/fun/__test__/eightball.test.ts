import { ChatInputCommandInteraction } from 'discord.js';
import eightballCommand from '../eightball';
import { mockInteractionBasics } from '../../../utils/testUtils';

describe('eightball', () => {
	beforeEach(() => {
		// Mock Math.random to always return 0, which will select the first response - i.e. 'It is certain'
		jest.spyOn(Math, 'random').mockReturnValue(0);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should format a standard question correctly', async () => {
		const mockInteraction = {
			...mockInteractionBasics,
			options: {
                getString: jest.fn().mockReturnValue('Test question?'),
            },
		} as unknown as ChatInputCommandInteraction;

		await eightballCommand.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith('**Test question?**\nIt is certain');
	});

	it('should format a question without question mark', async () => {
		const mockInteraction = {
			...mockInteractionBasics,
			options: {
                getString: jest.fn().mockReturnValue('Will it rain today'),
            },
		} as unknown as ChatInputCommandInteraction;

		await eightballCommand.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith('**Will it rain today?**\nIt is certain');
	});

	it('should handle question ending with period', async () => {
		const mockInteraction = {
			...mockInteractionBasics,
			options: {
                getString: jest.fn().mockReturnValue('Is this working.'),
            },
		} as unknown as ChatInputCommandInteraction;

		await eightballCommand.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith('**Is this working?**\nIt is certain');
	});

    it('should handle question ending with exclamation mark', async () => {
		const mockInteraction = {
			...mockInteractionBasics,
			options: {
                getString: jest.fn().mockReturnValue('Now I\'m shouting!'),
            },
		} as unknown as ChatInputCommandInteraction;

		await eightballCommand.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith('**Now I\'m shouting?**\nIt is certain');
	});

	it('should return error message when no question provided', async () => {
		const mockInteraction = {
			...mockInteractionBasics,
			options: {
                getString: jest.fn().mockReturnValue(null),
            },
		} as unknown as ChatInputCommandInteraction;

		await eightballCommand.execute(mockInteraction);

		expect(mockInteraction.reply).toHaveBeenCalledWith('Please ask a question.');
	});
});
