import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

const eightball = async (interaction: ChatInputCommandInteraction) => {
	const eightballResponses = [
		'It is certain',
		'Reply hazy, try again',
		'Don\'t count on it',
		'It is decidedly so',
		'Ask again later',
		'My reply is no',
		'Without a doubt',
		'Better not tell you now',
		'My sources say no',
		'Yes definitely',
		'Cannot predict now',
		'Outlook not so good',
		'You may rely on it',
		'Concentrate and ask again',
		'Very doubtful',
		'As I see it, yes',
		'Most likely',
		'Outlook good',
		'Yes',
		'Signs point to yes',
	];

	const question = interaction.options.getString('question');
	const response = eightballResponses[Math.floor(Math.random() * eightballResponses.length)];
	let formattedQuestion = question;
	if (!formattedQuestion) {
		return await interaction.reply('Please ask a question.');
	}
	if (!question?.endsWith('?')) {
		if (question?.endsWith('.') || question?.endsWith('!')) {
			formattedQuestion = formattedQuestion.slice(0, -1);
		}
		formattedQuestion += '?';
	}
	
	await interaction.reply(`**${formattedQuestion}**\n${response}`);
};

const eightballCommand = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Get a mystical answer to your question.')
		.addStringOption((option) =>
			option
				.setName('question')
				.setDescription('The question you want to ask the 8ball.')
				.setRequired(true)
		),
	execute: eightball,
};

export default eightballCommand;
