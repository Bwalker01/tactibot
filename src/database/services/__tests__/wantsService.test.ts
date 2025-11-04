import { DatabaseController } from '../../databaseController';
import {
	getAllWantedCardsOfUser,
	getAllUsersOfWantedCard,
	getAllWantedCards,
} from '../wantsService';

// Mock the DatabaseController
jest.mock('../../databaseController', () => {
	return {
		DatabaseController: {
			getInstance: jest.fn(),
		},
	};
});

describe('wantsService', () => {
	let mockDatabaseController: jest.Mocked<DatabaseController>;
	let mockQueryAll: jest.Mock;

	beforeEach(() => {
		// Reset mocks before each test
		jest.clearAllMocks();

		// Create mock queryAll function
		mockQueryAll = jest.fn();

		// Create mock DatabaseController instance
		mockDatabaseController = {
			queryAll: mockQueryAll,
		} as unknown as jest.Mocked<DatabaseController>;

		// Mock getInstance to return our mock
		(DatabaseController.getInstance as jest.Mock).mockReturnValue(mockDatabaseController);
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

			expect(DatabaseController.getInstance).toHaveBeenCalled();
			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards');
			expect(result).toEqual(
				mockRows.map((row) => ({
					id: row.id,
					userId: row.user_id,
					cardName: row.card_name,
					cardLink: row.scryfall_link,
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
				{ id: 1, userId: userId, cardName: 'Card A' },
				{ id: 2, userId: userId, cardName: 'Card B' },
			];

			mockQueryAll.mockResolvedValue({ rows: mockRows });

			const result = await getAllWantedCardsOfUser(userId);

			expect(DatabaseController.getInstance).toHaveBeenCalled();
			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards WHERE user_id = $1', [
				userId,
			]);
			expect(result).toEqual(mockRows);
		});

		it('should return an empty array when user has no wanted cards', async () => {
			const userId = '999';
			mockQueryAll.mockResolvedValue({ rows: [] });

			const result = await getAllWantedCardsOfUser(userId);

			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards WHERE user_id = $1', [
				userId,
			]);
			expect(result).toEqual([]);
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

		it('should handle empty string userId', async () => {
			const userId = '';
			mockQueryAll.mockResolvedValue({ rows: [] });

			const result = await getAllWantedCardsOfUser(userId);

			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards WHERE user_id = $1', [
				userId,
			]);
			expect(result).toEqual([]);
		});
	});

	describe('getAllUsersOfWantedCard', () => {
		it('should return all users who want a specific card', async () => {
			const cardName = 'Card A';
			const mockRows = [
				{ id: 1, user_id: '123', card_name: cardName },
				{ id: 2, user_id: '456', card_name: cardName },
				{ id: 3, user_id: '789', card_name: cardName },
			];

			mockQueryAll.mockResolvedValue({ rows: mockRows });

			const result = await getAllUsersOfWantedCard(cardName);

			expect(DatabaseController.getInstance).toHaveBeenCalled();
			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards WHERE card_name = $1', [
				cardName,
			]);
			expect(result).toEqual(mockRows);
		});

		it('should return an empty array when no users want the card', async () => {
			const cardName = 'Non-existent Card';
			mockQueryAll.mockResolvedValue({ rows: [] });

			const result = await getAllUsersOfWantedCard(cardName);

			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards WHERE card_name = $1', [
				cardName,
			]);
			expect(result).toEqual([]);
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
			const mockRows = [{ id: 1, user_id: '123', card_name: cardName }];

			mockQueryAll.mockResolvedValue({ rows: mockRows });

			const result = await getAllUsersOfWantedCard(cardName);

			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards WHERE card_name = $1', [
				cardName,
			]);
			expect(result).toEqual(mockRows);
		});

		it('should handle empty string card name', async () => {
			const cardName = '';
			mockQueryAll.mockResolvedValue({ rows: [] });

			const result = await getAllUsersOfWantedCard(cardName);

			expect(mockQueryAll).toHaveBeenCalledWith('SELECT * FROM wanted_cards WHERE card_name = $1', [
				cardName,
			]);
			expect(result).toEqual([]);
		});
	});
});
