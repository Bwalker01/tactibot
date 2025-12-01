import eightballCommand from './fun/eightball';
import allWantedCardsCommand from './trading/allWantedCards';
import newWantedCardCommand from './trading/newWantedCard';
import pingCommand from './utility/ping';

const commands = {
	utility: {
		ping: pingCommand,
	},
	fun: {
		eightball: eightballCommand,
	},
	trading: {
		wantedCards: allWantedCardsCommand,
		newWantedCard: newWantedCardCommand,
	},
};

export default commands;
