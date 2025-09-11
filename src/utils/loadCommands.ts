import { Client, Collection } from 'discord.js';

export function loadCommands(client: Client) {
	client.commands = new Collection();
}
