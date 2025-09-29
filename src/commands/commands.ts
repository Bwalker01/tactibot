import eightballCommand from './fun/eightball';
import pingCommand from './utility/ping';

const commands = {
	utility: {
		ping: pingCommand,
	},
	fun: {
		eightball: eightballCommand,
	},
};

export default commands;
