import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
} from 'discord.js';
import { getAllWantedCardsOfUser } from '../../database/services/wantsService';
import { footerCreator } from '../../utils/footerCreator';
import { quoteGenerator } from '../../utils/quoteGenerator';

const myWantedCards = async (interaction: ChatInputCommandInteraction) => {
	const wantedCards = await getAllWantedCardsOfUser(interaction.user.id);

	const embed = new EmbedBuilder()
		.setTitle('Your Wants:')
		.setDescription(wantedCards.cards.map((card) => `[${card.name}](${card.link})`).join('\n'))
		.setFooter({ text: footerCreator() });
	embed.addFields(quoteGenerator());

	const cardSelect = new StringSelectMenuBuilder()
		.setCustomId('card-edit-select')
		.setPlaceholder('Select a card to edit')
		.addOptions(wantedCards.cards.map((card) => ({ label: card.name, value: card.name })));

	const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(cardSelect);

	await interaction.reply({ embeds: [embed], components: [actionRow], ephemeral: true });
};

const myWantedCardsCommand = {
	data: new SlashCommandBuilder()
		.setName('my-wants')
		.setDescription('See and edit your wanted cards.'),
	execute: myWantedCards,
};

export default myWantedCardsCommand;
