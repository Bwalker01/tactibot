import { DatabaseController } from '../databaseController';

export const getAllWantedCards = async (): Promise<WantedCard[]> => {
	const db = DatabaseController.getInstance();
	const result = await db.queryAll('SELECT * FROM wanted_cards');
	return result.rows.map((row) => ({
		id: row.id,
		userId: row.user_id,
		cardName: row.card_name,
		cardLink: row.scryfall_link,
	}));
};

export const getAllWantedCardsOfUser = async (userId: string) => {
	const db = DatabaseController.getInstance();
	const result = await db.queryAll('SELECT * FROM wanted_cards WHERE user_id = $1', [userId]);
	return result.rows;
};

export const getAllUsersOfWantedCard = async (cardName: string) => {
	const db = DatabaseController.getInstance();
	const result = await db.queryAll('SELECT * FROM wanted_cards WHERE card_name = $1', [cardName]);
	return result.rows;
};

export const addWantedCard = async ({
	userId,
	cardName,
	cardLink,
}: {
	userId: string;
	cardName: string;
	cardLink: string;
}): Promise<boolean> => {
	const db = DatabaseController.getInstance();
	const result = await db.execute(
		'INSERT INTO wanted_cards (user_id, card_name, scryfall_link) VALUES ($1, $2, $3)',
		[userId, cardName, cardLink]
	);
	return result;
};
