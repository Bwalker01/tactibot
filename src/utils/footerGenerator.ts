export const footerGenerator = () => {
    const quote = quotes[Math.floor(Math.random() * quotes.length)]!;
    return `${quote.quote} ~${quote.author} | [${quote.card}](${quote.cardLink})`;
}

const quotes: { quote: string, author: string, card: string, cardLink: string }[] = [
    { quote: "If there can be no victory, then I will fight forever.", author: "Koth of the Hammer", card: "Darksteel Plate", cardLink: "https://scryfall.com" },
    { quote: "You. Poet. Be sure to write this down.", author: "Fabled Hero", card: "Fabled Hero", cardLink: "https://scryfall.com" },
    { quote: "There is no knowledge that is not power.", author: "Unknown", card: "Enter the Infinite", cardLink: "https://scryfall.com" },
    { quote: "Don't just have an idea - have all of them.", author: "Unknown", card: "Enter the Infinite", cardLink: "https://scryfall.com" },
    { quote: "He didn't have a word for 'home', but he knew it was something to be defended.", author: "Unknown", card: "Ogre Resister", cardLink: "https://scryfall.com" },
    { quote: "No life is without meaning. No living thing too small to be strong.", author: "Unknown", card: "Healer of the Pride", cardLink: "https://scryfall.com" },
];