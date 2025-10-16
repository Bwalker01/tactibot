import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

const addWant = async (interaction: ChatInputCommandInteraction) => {};

const addWantCommand = {
	data: new SlashCommandBuilder()
		.setName('add-want')
		.setDescription('Adds a new wanted card to your list.'),
	execute: addWant,
};

export default addWantCommand;
