import { REST, Routes } from 'discord.js';
import commands from '../commands/commands';

export async function portCommands({ token, clientId }: { token: string; clientId: string }) {
	const rest = new REST().setToken(token);
	try {
		console.log('Refreshing commands...');
		await rest.delete(Routes.applicationCommands(clientId));
		Object.keys(commands).forEach(async (category) => {
			console.log(`Creating ${category} commands...`);
			const categoryCommands = commands[category as keyof typeof commands];
			await rest.put(Routes.applicationCommands(clientId), { body: categoryCommands });
			console.log(`${category.charAt(0).toUpperCase() + category.slice(1)} commands created.`);
		});
	} catch (error) {
		console.error(error);
	}
}
