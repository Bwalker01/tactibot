import eightballCommand from './fun/eightball';
import addWantCommand from './trading/addWant';
import pingCommand from './utility/ping';

const commands = {
	utility: {
		ping: pingCommand,
	},
	fun: {
		eightball: eightballCommand,
	},
	trading: {
		addWant: addWantCommand,
	},
};

export default commands;
