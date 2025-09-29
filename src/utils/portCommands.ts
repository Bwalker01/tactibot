import { REST, Routes } from 'discord.js';
import commands from '../commands/commands';
import cliProgress from 'cli-progress';

export function portCommands({ token, clientId }: { token: string; clientId: string }) {
	const rest = new REST().setToken(token);
	const bar = new cliProgress.SingleBar(
		{
			hideCursor: true,
			format: ' {bar} | {percentage}% | {value}/{total} categories',
		},
		cliProgress.Presets.shades_grey
	);

	async () => {
		try {
			console.log('Refreshing commands...');
			await rest.delete(Routes.applicationCommands(clientId));
			bar.start(Object.keys(commands).length, 0);
			Object.keys(commands).forEach(async (category) => {
				console.log(`Creating ${category} commands...`);
				const categoryCommands = commands[category as keyof typeof commands];
				await rest.put(Routes.applicationCommands(clientId), { body: categoryCommands });
				console.log(`${category.charAt(0).toUpperCase() + category.slice(1)} commands created.`);
				bar.increment();
			});
		} catch (error) {
			bar.stop();
			console.error(error);
		}
	};
}
