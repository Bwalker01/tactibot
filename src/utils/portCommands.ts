import { REST, Routes } from 'discord.js';
import commands from '../commands/interactions';

export async function portCommands({ token, clientId }: { token: string; clientId: string }) {
	const rest = new REST().setToken(token);

	// Flatten all commands and extract the data (SlashCommandBuilder) as JSON
	const allCommands = Object.values(commands)
		.flatMap((category) => Object.values(category))
		.map((command) => command.data.toJSON());

	console.log(allCommands.map((command) => command.name));

	try {
		console.log(`Started refreshing ${allCommands.length} application (/) commands.`);

		// PUT will automatically add/update/remove commands as needed
		await rest.put(Routes.applicationCommands(clientId), { body: allCommands });

		console.log(`Successfully reloaded ${allCommands.length} application (/) commands.`);
	} catch (error) {
		console.error('Error refreshing commands:', error);
	}
}
