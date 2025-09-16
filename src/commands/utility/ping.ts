import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

const ping = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply(`Pong! ***${interaction.client.ws.ping}**ms*`);
};

const pingCommand = {
	data: new SlashCommandBuilder()
	.setName('ping')
	.setDescription("Gets the bot's latency."),
	execute: ping,
};

export default pingCommand;