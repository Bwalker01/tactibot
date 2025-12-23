import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
} from 'discord.js';
import { getAllWantedCardsOfUser, removeWantedCard } from '../../database/services/wantsService';
import { footerCreator } from '../../utils/footerCreator';
import { quoteGenerator } from '../../utils/quoteGenerator';
import { UserWantedCards } from '../../database/types/wantedCards';

const myWantedCards = async (interaction: ChatInputCommandInteraction) => {
	const wantedCards = await getAllWantedCardsOfUser(interaction.user.id);

	const embed = new EmbedBuilder()
		.setTitle('Your Wants:')
		.setDescription(wantedCards.cards.map((card) => `[${card.name}](${card.link})`).join('\n'))
		.setFooter({ text: footerCreator() });
	embed.addFields(quoteGenerator());

	const cardSelect = cardEditSelectMenu.create(wantedCards);

	const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(cardSelect);

	await interaction.reply({ embeds: [embed], components: [actionRow], ephemeral: true });
};

export const myWantedCardsCommand = {
	data: new SlashCommandBuilder()
		.setName('my-wants')
		.setDescription('See and edit your wanted cards.'),
	execute: myWantedCards,
};

const cardEditSelect = async (interaction: StringSelectMenuInteraction) => {
	const cardName = interaction.values[0];
	if (!cardName) return;
	const wantedCards = await getAllWantedCardsOfUser(interaction.user.id);
	await interaction.message.edit({
		components: [
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				cardEditSelectMenu.create(wantedCards)
			),
			new ActionRowBuilder<ButtonBuilder>().addComponents(removeWantedCardButton.create(cardName)),
		],
	});
};

export const cardEditSelectMenu = {
	create: (wantedCards: UserWantedCards) =>
		new StringSelectMenuBuilder()
			.setCustomId('trading:my-wants:card-edit-select')
			.setPlaceholder('Select a card to edit')
			.addOptions(wantedCards.cards.map((card) => ({ label: card.name, value: card.name }))),
	execute: cardEditSelect,
};

const removeWantedCardInteraction = async (interaction: ButtonInteraction) => {
	const cardName = interaction.customId.split(':')[3];
	if (!cardName) return;
	const result = await removeWantedCard(cardName);
	if (result) {
		await interaction.message.edit({
			components: [],
		});
	} else {
		await interaction.reply({ content: 'Failed to remove card. \\:(', ephemeral: true });
	}
};

export const removeWantedCardButton = {
	create: (cardName: string) =>
		new ButtonBuilder()
			.setCustomId(`trading:my-wants:remove-card:${cardName}`)
			.setLabel('Remove')
			.setStyle(ButtonStyle.Danger),
	execute: removeWantedCardInteraction,
};
