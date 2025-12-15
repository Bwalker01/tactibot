import type { Interaction, SlashCommandBuilder } from 'discord.js';
import { isChatInputCommand, isStringSelectMenuInteraction } from '../utils/interactionTypeGuard';
import commands from './commands';

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
	if (isStringSelectMenuInteraction(event)) {
		try {
			// TODO: How do we map to these interactions?
		} catch (error) {
			console.error(`Error executing string select menu interaction ${event.customId}:`, error);
			if (event.replied || event.deferred) {
				await event.followUp({
					content: 'There was an error executing this interaction.',
					ephemeral: true,
				});
			} else {
				await event.reply({
					content: 'There was an error executing this interaction.',
					ephemeral: true,
				});
			}
		}
	}
}
