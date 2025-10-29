import { Client, Events, GatewayIntentBits } from 'discord.js';
import { routeInteraction } from '../interactions/router';
import { portCommands } from './portCommands';

export function setupClient(token: string) {
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });

	client.on(Events.ClientReady, (event) => {
		console.log(`Logged in as ${event.user.tag}.`);
		portCommands({ token, clientId: client.user!.id });
	});

	client.on(Events.InteractionCreate, async (event) => {
		await routeInteraction(event);
	});

	return client;
}
