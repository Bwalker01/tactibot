import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
	MessageFlags,
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

	if (wantedCards.cards.length === 0) {
		return await interaction.reply({
			content: 'You have no wanted cards. Use `/want <card-name>` to add new ones!',
			flags: MessageFlags.Ephemeral,
		});
	}

	const embed = new EmbedBuilder()
		.setTitle('Your Wants:')
		.setDescription(wantedCards.cards.map((card) => `[${card.name}](${card.link})`).join('\n'))
		.setFooter({ text: footerCreator() });
	embed.addFields(quoteGenerator());

	const cardSelect = cardEditSelectMenu.create(wantedCards);

	const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(cardSelect);

	await interaction.reply({
		embeds: [embed],
		components: [actionRow],
		flags: MessageFlags.Ephemeral,
	});
};

export const myWantedCardsCommand = {
	data: new SlashCommandBuilder()
		.setName('my-wants')
		.setDescription('See and edit your wanted cards.'),
	execute: myWantedCards,
};

const cardEditSelectInteraction = async (interaction: StringSelectMenuInteraction) => {
	await interaction.deferUpdate();
	const cardId = interaction.values[0];
	if (!cardId) return;
	const wantedCards = await getAllWantedCardsOfUser(interaction.user.id);
	await interaction.editReply({
		components: [
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				cardEditSelectMenu.create(wantedCards, cardId)
			),
			new ActionRowBuilder<ButtonBuilder>().addComponents(removeWantedCardButton.create(cardId)),
		],
	});
};

export const cardEditSelectMenu = {
	create: (wantedCards: UserWantedCards, selectedCardId?: string) => {
		return new StringSelectMenuBuilder()
			.setCustomId('trading:my-wants:card-edit-select')
			.setPlaceholder('Select a card to edit')
			.addOptions(
				wantedCards.cards.map((card) => ({
					label: card.name,
					value: card.id,
					default: card.id === selectedCardId,
				}))
			);
	},
	execute: cardEditSelectInteraction,
};

const removeWantedCardInteraction = async (interaction: ButtonInteraction) => {
	await interaction.deferUpdate();
	const cardId = interaction.customId.split(':')[3];
	if (!cardId) return;
	const result = await removeWantedCard(cardId);
	if (result) {
		const wantedCards = await getAllWantedCardsOfUser(interaction.user.id);
		const hasWantedCards = wantedCards.cards.length > 0;
		const description = hasWantedCards
			? wantedCards.cards.map((card) => `[${card.name}](${card.link})`).join('\n')
			: 'You have no more wanted cards, use `/want <card-name>` to add new ones!';
		const embed = new EmbedBuilder()
			.setTitle('Your Wants:')
			.setDescription(description)
			.setFooter({ text: footerCreator() });
		embed.addFields(quoteGenerator());

		await interaction.editReply({
			embeds: [embed],
			components: hasWantedCards
				? [
						new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
							cardEditSelectMenu.create(wantedCards)
						),
					]
				: [],
		});
	} else {
		await interaction.reply({
			content: 'Failed to remove card. \\:(',
			flags: MessageFlags.Ephemeral,
		});
	}
};

export const removeWantedCardButton = {
	create: (cardId: string) =>
		new ButtonBuilder()
			.setCustomId(`trading:my-wants:remove-card:${cardId}`)
			.setLabel('Remove')
			.setStyle(ButtonStyle.Danger),
	execute: removeWantedCardInteraction,
};
