import type { Interaction, SlashCommandBuilder } from 'discord.js';
import { MessageFlags } from 'discord.js';
import {
	isButtonInteraction,
	isChatInputCommand,
	isStringSelectMenuInteraction,
} from '../utils/interactionTypeGuard';
import { commands, interactions } from './interactions';

type FlatCommandMap = {
	[name: string]: {
		data: SlashCommandBuilder;
		execute: (event: Interaction) => Promise<void>;
	};
};

type FlatInteractionMap = {
	[name: string]: {
		execute: (event: any) => Promise<any>;
	};
};

export async function routeInteraction(event: Interaction) {
	if (isChatInputCommand(event)) {
		const flatCommands: FlatCommandMap = Object.fromEntries(
			Object.values(commands)
				.flatMap((category) => Object.values(category))
				.map((command) => [command.data.name, command])
		);
		try {
			await flatCommands[event.commandName]?.execute(event);
		} catch (error) {
			console.error(`Error executing command ${event.commandName}:`, error);
			if (event.replied || event.deferred) {
				await event.followUp({
					content: 'There was an error executing this command.',
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await event.reply({
					content: 'There was an error executing this command.',
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	}

	if (isStringSelectMenuInteraction(event) || isButtonInteraction(event)) {
		// Parse customId: format is "category:command:interaction-type:optional-data"
		const [category, command, interactionType] = event.customId.split(':');

		// Build the flat interaction map
		const flatInteractionMap: FlatInteractionMap = Object.fromEntries(
			Object.entries(interactions).flatMap(([categoryName, categoryInteractions]) =>
				Object.entries(categoryInteractions).flatMap(([commandName, commandInteractions]) =>
					Object.entries(commandInteractions).map(([interactionName, interaction]) => [
						`${categoryName}:${commandName}:${interactionName}`,
						interaction,
					])
				)
			)
		);

		const interactionKey = `${category}:${command}:${interactionType}`;
		const interaction = flatInteractionMap[interactionKey];

		if (!interaction) {
			console.error(`No interaction found for customId: ${event.customId}`);
			return;
		}

		try {
			await interaction.execute(event);
		} catch (error) {
			console.error(`Error executing interaction ${event.customId}:`, error);
			if (event.replied || event.deferred) {
				await event.followUp({
					content: 'There was an error executing this interaction.',
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await event.reply({
					content: 'There was an error executing this interaction.',
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	}
}
