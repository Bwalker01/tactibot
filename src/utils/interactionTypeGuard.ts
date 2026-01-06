import type {
	ButtonInteraction,
	ChatInputCommandInteraction,
	Interaction,
	StringSelectMenuInteraction,
} from 'discord.js';

export function isChatInputCommand(event: Interaction): event is ChatInputCommandInteraction {
	return event.isChatInputCommand();
}

export function isStringSelectMenuInteraction(
	event: Interaction
): event is StringSelectMenuInteraction {
	return event.isStringSelectMenu();
}

export function isButtonInteraction(event: Interaction): event is ButtonInteraction {
	return event.isButton();
}
