import eightballCommand from './fun/eightball';
import allWantedCardsCommand from './trading/allWantedCards';
import {
	myWantedCardsCommand,
	cardEditSelectMenu,
	removeWantedCardButton,
} from './trading/myWantedCards';
import newWantedCardCommand from './trading/newWantedCard';
import pingCommand from './utility/ping';

export const commands = {
	utility: {
		ping: pingCommand,
	},
	fun: {
		eightball: eightballCommand,
	},
	trading: {
		wantedCards: allWantedCardsCommand,
		newWantedCard: newWantedCardCommand,
		myWantedCards: myWantedCardsCommand,
	},
};

export const interactions = {
	trading: {
		'my-wants': {
			'card-edit-select': cardEditSelectMenu,
			'remove-card': removeWantedCardButton,
		},
	},
};
