import { DatabaseController } from '../../databaseController';
import {
	getAllWantedCardsOfUser,
	getAllWantedCards,
	getAllUsersOfWantedCard,
} from '../wantsService';

// Mock the DatabaseController module
jest.mock('../../databaseController');

// Get the actual DatabaseController class for spying
const { DatabaseController: ActualDatabaseController } = jest.requireActual<
	typeof import('../../databaseController')
>('../../databaseController');

describe('wantsService', () => {
	let mockDatabaseController: jest.Mocked<DatabaseController>;
	let mockQueryAll: jest.Mock;
	let getInstanceSpy: jest.SpyInstance;

	beforeEach(() => {
		// Reset mocks before each test
		jest.clearAllMocks();

		// Create mock queryAll function
		mockQueryAll = jest.fn();

		// Create mock DatabaseController instance
		mockDatabaseController = {
			queryAll: mockQueryAll,
		} as unknown as jest.Mocked<DatabaseController>;

		// Use jest.spyOn on the actual class to mock the static method getInstance
		// This explicitly bypasses singleton logic by replacing the implementation
		getInstanceSpy = jest
			.spyOn(ActualDatabaseController, 'getInstance')
			.mockImplementation(() => mockDatabaseController);

		// Also ensure the mocked module's getInstance points to our spy
		(DatabaseController as any).getInstance = getInstanceSpy;
	});

	afterEach(() => {
		// Restore all mocks after each test
		jest.restoreAllMocks();
	});

	describe('getWantedCards', () => {
		it('should return all wanted cards', async () => {
			const mockRows = [
				{
					id: 1,
					user_id: '123',
					card_name: 'Card A',
					scryfall_link: 'https://scryfall.com/card/123/card-a',
				},
				{
					id: 2,
					user_id: '456',
					card_name: 'Card B',
					scryfall_link: 'https://scryfall.com/card/456/card-b',
				},
			];

			mockQueryAll.mockResolvedValue({ rows: mockRows });

			const result = await getAllWantedCards();

			expect(getInstanceSpy).toHaveBeenCalled();
			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards');
			expect(result).toEqual(
				mockRows.map((row) => ({
					id: row.id,
					userId: row.user_id,
					card: {
						name: row.card_name,
						link: row.scryfall_link,
					},
				}))
			);
		});

		it('should return an empty array when no cards are found', async () => {
			mockQueryAll.mockResolvedValue({ rows: [] });

			const result = await getAllWantedCards();

			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards');
			expect(result).toEqual([]);
		});

		it('should handle database errors', async () => {
			const error = new Error('Database connection failed');
			mockQueryAll.mockRejectedValue(error);

			await expect(getAllWantedCards()).rejects.toThrow('Database connection failed');
			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards');
		});
	});

	describe('getAllWantedCardsOfUser', () => {
		it('should return all wanted cards for a specific user', async () => {
			const userId = '123';
			const mockRows = [
				{
					id: 1,
					user_id: userId,
					card_name: 'Card A',
					scryfall_link: 'https://scryfall.com/card/123/card-a',
					card_id: '123',
				},
				{
					id: 2,
					user_id: userId,
					card_name: 'Card B',
					scryfall_link: 'https://scryfall.com/card/456/card-b',
					card_id: '456',
				},
			];

			mockQueryAll.mockResolvedValue({ rows: mockRows });

			const result = await getAllWantedCardsOfUser(userId);

			expect(getInstanceSpy).toHaveBeenCalled();
			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards WHERE user_id = $1', [
				userId,
			]);
			expect(result).toEqual({
				userId: '123',
				cards: [
					{
						name: 'Card A',
						link: 'https://scryfall.com/card/123/card-a',
						id: '123',
					},
					{
						name: 'Card B',
						link: 'https://scryfall.com/card/456/card-b',
						id: '456',
					},
				],
			});
		});

		it('should return an empty array when user has no wanted cards', async () => {
			const userId = '999';
			mockQueryAll.mockResolvedValue({ rows: [] });

			const result = await getAllWantedCardsOfUser(userId);

			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards WHERE user_id = $1', [
				userId,
			]);
			expect(result).toEqual({
				userId,
				cards: [],
			});
		});

		it('should handle database errors', async () => {
			const userId = '123';
			const error = new Error('Database query failed');
			mockQueryAll.mockRejectedValue(error);

			await expect(getAllWantedCardsOfUser(userId)).rejects.toThrow('Database query failed');
			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards WHERE user_id = $1', [
				userId,
			]);
		});

		it('should error on empty string userId', async () => {
			const userId = '';
			mockQueryAll.mockResolvedValue({ rows: [] });

			await expect(getAllWantedCardsOfUser(userId)).rejects.toThrow('User ID is required');
		});
	});

	describe('getAllUsersOfWantedCard', () => {
		it('should return all users who want a specific card', async () => {
			const cardName = 'Card A';
			const mockRows = [
				{
					id: 1,
					user_id: '123',
					card_name: cardName,
					scryfall_link: 'https://scryfall.com/card/123/card-a',
					card_id: '123',
				},
				{
					id: 2,
					user_id: '456',
					card_name: cardName,
					scryfall_link: 'https://scryfall.com/card/123/card-a',
					card_id: '123',
				},
				{
					id: 3,
					user_id: '789',
					card_name: cardName,
					scryfall_link: 'https://scryfall.com/card/456/card-a',
					card_id: '123',
				},
			];

			mockQueryAll.mockResolvedValue({ rows: mockRows });

			const result = await getAllUsersOfWantedCard(cardName);

			expect(getInstanceSpy).toHaveBeenCalled();
			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards WHERE card_name = $1', [
				cardName,
			]);
			expect(result).toEqual({
				card: {
					name: cardName,
					link: 'https://scryfall.com/card/123/card-a',
					id: '123',
				},
				userIds: ['123', '456', '789'],
			});
		});

		it('should error on empty card name', async () => {
			mockQueryAll.mockResolvedValue({ rows: [] });

			await expect(getAllUsersOfWantedCard('')).rejects.toThrow('Card name is required');
		});

		it('should handle database errors', async () => {
			const cardName = 'Card A';
			const error = new Error('Database query failed');
			mockQueryAll.mockRejectedValue(error);

			await expect(getAllUsersOfWantedCard(cardName)).rejects.toThrow('Database query failed');
			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards WHERE card_name = $1', [
				cardName,
			]);
		});

		it('should handle card names with special characters', async () => {
			const cardName = "Card's Name (Special Edition)";
			const mockRows = [
				{
					id: 1,
					user_id: '123',
					card_name: cardName,
					scryfall_link: 'https://scryfall.com/card/123/card-a',
					card_id: '123',
				},
			];

			mockQueryAll.mockResolvedValue({ rows: mockRows });

			const result = await getAllUsersOfWantedCard(cardName);

			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards WHERE card_name = $1', [
				cardName,
			]);
			expect(result).toEqual({
				card: {
					name: cardName,
					link: 'https://scryfall.com/card/123/card-a',
					id: '123',
				},
				userIds: ['123'],
			});
		});
	});
});
