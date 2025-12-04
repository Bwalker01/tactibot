import { Card } from './card';

export type WantedCard = {
	id: number;
	userId: string;
	card: Pick<Card, 'name' | 'link'>;
};

export type UserWantedCards = {
	userId: string;
	cards: Pick<Card, 'name' | 'link'>[];
};

export type CardWantedByUsers = {
	card: Pick<Card, 'name' | 'link'>;
	userIds: string[];
};
