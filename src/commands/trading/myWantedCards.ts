import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

const myWantedCards = async (interaction: ChatInputCommandInteraction) => {
	//TODO: Add logic here
};

const myWantedCardsCommand = {
	data: new SlashCommandBuilder()
		.setName('my-wants')
		.setDescription('Shows and edits your current wanted cards.'),
	execute: myWantedCards,
};

export default myWantedCardsCommand;
