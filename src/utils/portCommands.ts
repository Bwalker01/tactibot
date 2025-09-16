import { REST, Routes } from 'discord.js';
import commands from '../commands/commands';

export function portCommands({token, clientId}: {token: string, clientId: string}) {
	const rest = new REST().setToken(token);

	(async () => {
		try {
			console.log('Refreshing commands...');
			await rest.delete(Routes.applicationCommands(clientId));
			Object.keys(commands).forEach(async category => {
				console.log(`Creating ${category} commands...`)
				const categoryCommands = commands[category as keyof typeof commands];
				
			});
		} catch (error) {
			console.error(error);
		}
	})
}
