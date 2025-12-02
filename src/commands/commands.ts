import eightballCommand from './fun/eightball';
import allWantedCardsCommand from './trading/allWantedCards';
import myWantedCardsCommand from './trading/myWantedCards';
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
		myWantedCards: myWantedCardsCommand,
	},
};

export default commands;
