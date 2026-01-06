import { ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import newWantedCardCommand from '../newWantedCard';
import { addWantedCard } from '../../../database/services/wantsService';
import { mockInteractionBasics } from '../../../utils/testUtils';

// Mock the fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch as typeof fetch;

// Mock the wantsService
jest.mock('../../../database/services/wantsService');
const mockAddWantedCard = addWantedCard as jest.Mock<
	Promise<boolean>,
	Parameters<typeof addWantedCard>
>;

let mockCardData: { name: string; scryfall_uri: string; [key: string]: string | undefined };

beforeEach(() => {
	jest.clearAllMocks();
	mockCardData = {
		name: 'Lightning Bolt',
		scryfall_uri: 'https://scryfall.com/card/m21/161/lightning-bolt',
	};
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('newWantedCard', () => {
	describe('happy path', () => {
		it('should add valid cards to the database', async () => {
			mockFetch.mockResolvedValueOnce({
				json: jest.fn().mockResolvedValue(mockCardData),
			} as unknown as Response);
			mockAddWantedCard.mockResolvedValue(true);
			const mockInteraction = {
				...mockInteractionBasics,
				user: {
					id: '123456789',
				},
				options: {
					getString: jest.fn().mockReturnValue('Lightning Bolt'),
				},
			} as unknown as ChatInputCommandInteraction;

			await newWantedCardCommand.execute(mockInteraction);

			expect(mockFetch).toHaveBeenCalledWith(
				'https://api.scryfall.com/cards/named?fuzzy=lightning+bolt'
			);
			expect(mockAddWantedCard).toHaveBeenCalledWith(
				expect.objectContaining({
					userId: '123456789',
					cards: [
						{ name: 'Lightning Bolt', link: 'https://scryfall.com/card/m21/161/lightning-bolt' },
					],
				})
			);
		});

		it('should handle valid cards from a fuzzy search', async () => {});
	});

	describe('card name formatting', () => {
		it('should format card name with spaces correctly', async () => {
			const mockCardData = {
				name: 'Lightning Bolt',
				scryfall_uri: 'https://scryfall.com/card/m21/161/lightning-bolt',
				image_uris: {
					normal: 'https://cards.scryfall.io/normal/front/l/b/lb.jpg',
				},
			};

			const mockInteraction = {
				...mockInteractionBasics,
				user: {
					id: '123456789',
				},
				options: {
					getString: jest.fn().mockReturnValue('Lightning Bolt'),
				},
			} as unknown as ChatInputCommandInteraction;

			mockFetch.mockResolvedValueOnce({
				json: jest.fn().mockResolvedValueOnce(mockCardData),
			} as unknown as Response);

			mockAddWantedCard.mockResolvedValueOnce(true);

			await newWantedCardCommand.execute(mockInteraction);

			expect(mockFetch).toHaveBeenCalledWith(
				'https://api.scryfall.com/cards/named?fuzzy=lightning+bolt'
			);
		});

		it('should handle card name with multiple words', async () => {
			const mockCardData = {
				name: 'Black Lotus',
				scryfall_uri: 'https://scryfall.com/card/lea/4/black-lotus',
				image_uris: {
					normal: 'https://cards.scryfall.io/normal/front/b/l/bl.jpg',
				},
			};

			const mockInteraction = {
				...mockInteractionBasics,
				user: {
					id: '123456789',
				},
				options: {
					getString: jest.fn().mockReturnValue('Black Lotus'),
				},
			} as unknown as ChatInputCommandInteraction;

			mockFetch.mockResolvedValueOnce({
				json: jest.fn().mockResolvedValueOnce(mockCardData),
			} as unknown as Response);

			mockAddWantedCard.mockResolvedValueOnce(true);

			await newWantedCardCommand.execute(mockInteraction);

			expect(mockFetch).toHaveBeenCalledWith(
				'https://api.scryfall.com/cards/named?fuzzy=black+lotus'
			);
		});

		it('should handle uppercase card names', async () => {
			const mockCardData = {
				name: 'Lightning Bolt',
				scryfall_uri: 'https://scryfall.com/card/m21/161/lightning-bolt',
				image_uris: {
					normal: 'https://cards.scryfall.io/normal/front/l/b/lb.jpg',
				},
			};

			const mockInteraction = {
				...mockInteractionBasics,
				user: {
					id: '123456789',
				},
				options: {
					getString: jest.fn().mockReturnValue('LIGHTNING BOLT'),
				},
			} as unknown as ChatInputCommandInteraction;

			mockFetch.mockResolvedValueOnce({
				json: jest.fn().mockResolvedValueOnce(mockCardData),
			} as unknown as Response);

			mockAddWantedCard.mockResolvedValueOnce(true);

			await newWantedCardCommand.execute(mockInteraction);

			expect(mockFetch).toHaveBeenCalledWith(
				'https://api.scryfall.com/cards/named?fuzzy=lightning+bolt'
			);
		});
	});

	describe('error handling', () => {
		it('should handle card not found (404)', async () => {
			const mockInteraction = {
				...mockInteractionBasics,
				user: {
					id: '123456789',
				},
				options: {
					getString: jest.fn().mockReturnValue('Non Existent Card'),
				},
			} as unknown as ChatInputCommandInteraction;

			mockFetch.mockResolvedValueOnce({
				json: jest.fn().mockResolvedValueOnce({ status: 404 }),
			} as unknown as Response);

			await newWantedCardCommand.execute(mockInteraction);

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: 'Card not found. \\:(',
				flags: MessageFlags.Ephemeral,
			});
			expect(mockAddWantedCard).not.toHaveBeenCalled();
		});

		it('should handle failed card addition', async () => {
			const mockCardData = {
				name: 'Lightning Bolt',
				scryfall_uri: 'https://scryfall.com/card/m21/161/lightning-bolt',
				image_uris: {
					normal: 'https://cards.scryfall.io/normal/front/l/b/lb.jpg',
				},
			};

			const mockInteraction = {
				...mockInteractionBasics,
				user: {
					id: '123456789',
				},
				options: {
					getString: jest.fn().mockReturnValue('Lightning Bolt'),
				},
			} as unknown as ChatInputCommandInteraction;

			mockFetch.mockResolvedValueOnce({
				json: jest.fn().mockResolvedValueOnce(mockCardData),
			} as unknown as Response);

			mockAddWantedCard.mockResolvedValueOnce(false);

			await newWantedCardCommand.execute(mockInteraction);

			expect(mockInteraction.reply).toHaveBeenCalledWith({
				content: 'Failed to add card. \\:(',
				flags: MessageFlags.Ephemeral,
			});
		});
	});
});
