import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getAllWantedCards } from '../../database/services/wantsService';
import { quoteGenerator } from '../../utils/quoteGenerator';

const allWantedCards = async (interaction: ChatInputCommandInteraction) => {
	const wantedCards = await getAllWantedCards();
	const allCards: { userName: string; cards: WantedCard[] }[] = [];
	for (const card of wantedCards) {
		const user = interaction.guild?.members.cache.get(card.userId);
		if (!user) continue;
		if (allCards.map((listItem) => listItem.userName).includes(user.displayName)) {
			allCards.find((listItem) => listItem.userName === user.displayName)?.cards.push(card);
		} else {
			allCards.push({ userName: user.displayName, cards: [card] });
		}
	}

	const embed = new EmbedBuilder()
		.setTitle('Wants:')
		.setDescription('Here is a list of all the cards that users want to trade for:')
		.setFooter({ text: `Tactibot | ${process.version}` });
	for (const { userName, cards } of allCards) {
		embed.addFields({
			name: userName,
			value: cards.map((card) => `[${card.cardName}](${card.cardLink})`).join('\n'),
		});
	}
	embed.addFields(quoteGenerator());
	await interaction.reply({ embeds: [embed], ephemeral: true });
};

const allWantedCardsCommand = {
	data: new SlashCommandBuilder()
		.setName('wanted-cards')
		.setDescription('Shows all the wanted cards of users in this server.'),
	execute: allWantedCards,
};

export default allWantedCardsCommand;
