import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const ping = new SlashCommandBuilder()
	.setName('ping')
	.setDescription("Gets the bot's latency.");

export const pingCommand = {
	data: ping,
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply(`Pong! ***${interaction.client.ws.ping}**ms*`);
	},
};
