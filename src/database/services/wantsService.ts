import { DatabaseController } from '../databaseController';
import { UserWantedCards, WantedCard } from '../types/wantedCards';

/**
 * Get all wanted cards stored in the database.
 * @returns An array of users and their wanted cards.
 */
export const getAllWantedCards = async (): Promise<WantedCard[]> => {
	const db = DatabaseController.getInstance();
	const result = await db.queryAll('SELECT * FROM wanted_cards');
	return result.rows.map((row) => ({
		id: row.id,
		userId: row.user_id,
		card: {
			name: row.card_name,
			link: row.scryfall_link,
		},
	}));
};

/**
 * Get all wanted cards for a specific user.
 * @param userId The ID of the user to get wanted cards for.
 * @returns The user's ID and an array of their wanted cards.
 */
export const getAllWantedCardsOfUser = async (userId: string): Promise<UserWantedCards> => {
	const db = DatabaseController.getInstance();
	const result = await db.queryAll('SELECT * FROM wanted_cards WHERE user_id = $1', [userId]);
	return {
		userId,
		cards: result.rows.map((row) => ({ name: row.card_name, link: row.scryfall_link })),
	};
};

export const addWantedCard = async (wants: UserWantedCards): Promise<boolean> => {
	const db = DatabaseController.getInstance();
	for (const want of wants.cards) {
		await db.execute(
			'INSERT INTO wanted_cards (user_id, card_name, scryfall_link) VALUES ($1, $2, $3)',
			[wants.userId, want.name, want.link]
		);
	}
	return true;
};
