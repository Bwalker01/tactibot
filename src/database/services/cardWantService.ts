import { DatabaseController } from '../databaseController';

export const getWantedCards = async () => {
	const db = DatabaseController.getInstance();
	const result = await db.queryAll('SELECT * FROM wanted_cards');
	return result.rows;
};
