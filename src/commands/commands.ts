import eightballCommand from './fun/eightball';
import allWantedCardsCommand from './trading/allWantedCards';
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
	},
};

export default commands;
