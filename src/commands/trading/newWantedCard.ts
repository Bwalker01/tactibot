import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { SCRYFALL_API_URL } from '../../utils/constants';
import { addWantedCard } from '../../database/services/wantsService';

const newWantedCard = async (interaction: ChatInputCommandInteraction) => {
	const cardName = interaction.options.getString('card');
	const formattedName = cardName?.toLowerCase().replace(/ /g, '+');
	const url = `${SCRYFALL_API_URL}/cards/named?fuzzy=${formattedName}`;
	const response = await fetch(url);
	const data = await response.json();
	if (data.status === 404) {
		return await interaction.reply({ content: 'Card not found. \\:(', ephemeral: true });
	}
	const result = await addWantedCard({
		userId: interaction.user.id,
		cards: [{ name: data.name, link: data.scryfall_uri }],
	});
	if (result) {
		const imageUrl =
			data.image_uris?.large ||
			data.image_uris?.normal ||
			data.card_faces?.[0]?.image_uris?.large ||
			data.card_faces?.[0]?.image_uris?.normal;

		const embed = new EmbedBuilder()
			.setTitle(`${data.name} added successfully! \\:)`)
			.setImage(imageUrl || null);

		return await interaction.reply({ embeds: [embed], ephemeral: true });
	}
	return await interaction.reply({ content: 'Failed to add card. \\:(', ephemeral: true });
};

const newWantedCardCommand = {
	data: new SlashCommandBuilder()
		.setName('want')
		.setDescription('Add a new wanted card to your list.')
		.addStringOption((option) =>
			option.setName('card').setDescription('The name of the card you want.').setRequired(true)
		),
	execute: newWantedCard,
};

export default newWantedCardCommand;
