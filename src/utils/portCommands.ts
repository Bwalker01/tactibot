import { REST, Routes } from 'discord.js';
import commands from '../commands/commands';

export async function portCommands({ token, clientId }: { token: string; clientId: string }) {
	const rest = new REST().setToken(token);
	
	// Flatten all commands from all categories into a single array
	const allCommands = Object.values(commands).flatMap((category) => Object.values(category));
	
	try {
		console.log(`Started refreshing ${allCommands.length} application (/) commands.`);
		
		// PUT will automatically add/update/remove commands as needed
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: allCommands }
		);
		
		console.log(`Successfully reloaded ${allCommands.length} application (/) commands.`);
	} catch (error) {
		console.error('Error refreshing commands:', error);
	}
}
