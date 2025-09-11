import type { Interaction } from 'discord.js';
import { isChatInputCommand } from '../utils/interactionTypeGuard';

export async function routeInteraction(event: Interaction) {
	if (isChatInputCommand(event)) {
		// TODO: Handle chat input command
	}
}
