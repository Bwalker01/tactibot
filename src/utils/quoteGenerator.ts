export const quoteGenerator = () => {
	const quote = quotes[Math.floor(Math.random() * quotes.length)]!;
	return {
		name: `"*${quote.quote}*"`,
		value: quote.author
			? `~ ${quote.author} | [${quote.card}](${quote.cardLink})`
			: `~ [${quote.card}](${quote.cardLink})`,
	};
};

const quotes: { quote: string; author?: string; card: string; cardLink: string }[] = [
	{
		quote: 'If there can be no victory, then I will fight forever.',
		author: 'Koth of the Hammer',
		card: 'Darksteel Plate',
		cardLink: 'https://scryfall.com/card/mbs/104/darksteel-plate',
	},
	{
		quote: 'You. Poet. Be sure to write this down.',
		card: 'Fabled Hero',
		cardLink: 'https://scryfall.com/card/ths/12/fabled-hero',
	},
	{
		quote: 'There is no knowledge that is not power.',
		card: 'Enter the Infinite',
		cardLink: 'https://scryfall.com/card/rvr/449/enter-the-infinite',
	},
	{
		quote: "Don't just have an idea - have all of them.",
		author: 'Niv-Mizzet',
		card: 'Enter the Infinite',
		cardLink: 'https://scryfall.com/card/gtc/34/enter-the-infinite',
	},
	{
		quote: "He didn't have a word for 'home', but he knew it was something to be defended.",
		card: 'Ogre Resister',
		cardLink: 'https://scryfall.com/card/mbs/72/ogre-resister',
	},
	{
		quote: 'No life is without meaning. No living thing too small to be strong.',
		card: 'Healer of the Pride',
		cardLink: 'https://scryfall.com/card/m13/19/healer-of-the-pride',
	},
	{
		quote: "Someday, someone will best me. But it won't be today, and it won't be you.",
		card: 'Last Word',
		cardLink: 'https://scryfall.com/card/dst/23/last-word',
	},
	{
		quote: 'Ribbit.',
		card: 'Turn to Frog',
		cardLink: 'https://scryfall.com/card/clu/103/turn-to-frog',
	},
	{
		quote:
			'Its diet consists of fruits, plants, small woodland animals, large woodland animals, woodlands, fruit groves, fruit farmers, and small cities.',
		card: 'Enormous Baloth',
		cardLink: 'https://scryfall.com/card/m10/180/enormous-baloth',
	},
	{
		quote:
			"Sun follows Moon until she tires, then carries her until she's strong and runs ahead of him again.",
		author: 'Love Song of Night and Day',
		card: 'Chariot of the Sun',
		cardLink: 'https://scryfall.com/card/mir/297/chariot-of-the-sun',
	},
	{
		quote: 'They certainly are.',
		card: 'Goblin Offensive',
		cardLink: 'https://scryfall.com/card/hop/56/goblin-offensive',
	},
	{
		quote: 'With great power comes great risk of getting yourself killed.',
		card: 'Goblin Arsonist',
		cardLink: 'https://scryfall.com/card/m21/147/goblin-arsonist',
	},
	{
		quote: '[...]there might be more to gain from experiencing the rain than running from it.',
		card: 'Rain of Revelation',
		cardLink: 'https://scryfall.com/card/m21/61/rain-of-revelation',
	},
	{
		quote:
			'Through the haze of battle I saw the glint of sun on golden mane, the sheen of glory clad in mail, and I dropped my sword and wept at the idiocy of war.',
		author: 'Dravin, Gruul deserter',
		card: 'Blazing Archon',
		cardLink: 'https://scryfall.com/card/rvr/8/blazing-archon',
	},
	{
		quote: 'Hatred outlives the hateful',
		card: 'Rancor',
		cardLink: 'https://scryfall.com/card/2x2/156/rancor',
	},
	{
		quote: 'It is the duty of the strong to oppose any who threaten the weak.',
		author: 'The Southern Paladin',
		card: 'Vengeance',
		cardLink: 'https://scryfall.com/card/7ed/54/vengeance',
	},
	{
		quote: 'A bullet renders all size equal',
		card: 'Vengeance',
		cardLink: 'https://scryfall.com/card/p02/27/vengeance',
	},
	{
		quote: 'To become is to understand.',
		card: 'Werebear',
		cardLink: 'https://scryfall.com/card/ema/191/werebear',
	},
	{
		quote: 'He exercises his right to bear arms.',
		card: 'Werebear',
		cardLink: 'https://scryfall.com/card/dmr/182/werebear',
	},
	{
		quote: '[...]the power to endure harm outlives the power to inflict it.',
		card: 'Blood of the Martyr',
		cardLink: 'https://scryfall.com/card/chr/4/blood-of-the-martyr',
	},
	{
		quote: 'A fool knows no fear. A hero shows no fear.',
		card: 'Intrepid Hero',
		cardLink: 'https://scryfall.com/card/m13/20/intrepid-hero',
	},
	{
		quote: "Dinner and politics don't mix.",
		card: 'Disrupt Decorum',
		cardLink: 'https://scryfall.com/card/mkc/151/disrupt-decorum',
	},
];
