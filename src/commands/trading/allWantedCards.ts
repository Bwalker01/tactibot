import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getAllWantedCards } from '../../database/services/wantsService';
import { quoteGenerator } from '../../utils/quoteGenerator';
import { footerCreator } from '../../utils/footerCreator';
import { UserWantedCards } from '../../database/types/wantedCards';

const allWantedCards = async (interaction: ChatInputCommandInteraction) => {
	const wantedCards = await getAllWantedCards();
	const allCards: UserWantedCards[] = [];
	for (const want of wantedCards) {
		if (allCards.map((listItem) => listItem.userId).includes(interaction.user.id)) {
			allCards.find((listItem) => listItem.userId === interaction.user.id)?.cards.push(want.card);
		} else {
			allCards.push({ userId: interaction.user.id, cards: [want.card] });
		}
	}

	const embed = new EmbedBuilder()
		.setTitle('Wants:')
		.setDescription('Here is a list of all the cards that users want to trade for:')
		.setFooter({ text: footerCreator() });
	for (const wants of allCards) {
		const user =
			interaction.guild?.members.cache.get(wants.userId) ||
			(await interaction.client.users.fetch(wants.userId));
		embed.addFields({
			name: user.displayName,
			value: wants.cards.map((card) => `[${card.name}](${card.link})`).join('\n'),
		});
	}
	embed.addFields(quoteGenerator());
	await interaction.reply({ embeds: [embed], ephemeral: true });
};

const allWantedCardsCommand = {
	data: new SlashCommandBuilder()
		.setName('all-wants')
		.setDescription("See everyone's wanted cards."),
	execute: allWantedCards,
};

export default allWantedCardsCommand;
