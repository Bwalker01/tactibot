export type WantedCard = {
	id: number;
	userId: string;
	cardName: string;
	cardLink: string;
};

export type UserWantedCards = {
	userId: string;
	cards: string[];
};

export type WantedCardUsers = {
	cardName: string;
	users: string[];
};
