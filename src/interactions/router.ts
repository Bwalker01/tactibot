import type { Interaction, SlashCommandBuilder } from 'discord.js';
import { isChatInputCommand } from '../utils/interactionTypeGuard';
import commands from '../commands/commands';

type FlatCommandMap = {
	[name: string]: {
		data: SlashCommandBuilder;
		execute: (event: Interaction) => Promise<void>;
	};
};

export async function routeInteraction(event: Interaction) {
	const flatCommands: FlatCommandMap = Object.fromEntries(
		Object.values(commands)
			.flatMap((category) => Object.values(category))
			.map((command) => [command.data.name, command])
	);
	if (isChatInputCommand(event)) {
		try {
			await flatCommands[event.commandName]?.execute(event);
		} catch (error) {
			console.error(`Error executing command ${event.commandName}:`, error);
			if (event.replied || event.deferred) {
				await event.followUp({
					content: 'There was an error executing this command.',
					ephemeral: true,
				});
			} else {
				await event.reply({
					content: 'There was an error executing this command.',
					ephemeral: true,
				});
			}
		}
	}
}
