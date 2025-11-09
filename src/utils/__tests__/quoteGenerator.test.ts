import { quoteGenerator } from '../quoteGenerator';

describe('quoteGenerator', () => {
	it('should return with the expected format', () => {
		const result = quoteGenerator();
		// Format: "quote ~author | [card](link)"
		expect(result.name).toMatch(/^\*.*\*$/);
		expect(result.value).toMatch(/^(~ .+\ \| )?\[.+\]\((https\:\/\/scryfall\.com\/card\/).+\)$/);
	});

	describe('specific quote validation', () => {
		// Mock Math.random to test specific quotes
		beforeEach(() => {
			jest.spyOn(Math, 'random');
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('should return the first quote when Math.random returns 0', () => {
			(Math.random as jest.Mock).mockReturnValue(0);

			const result = quoteGenerator();

			expect(result.name).toContain('If there can be no victory, then I will fight forever.');
			expect(result.value).toContain('Koth of the Hammer');
			expect(result.value).toContain(
				'[Darksteel Plate](https://scryfall.com/card/mbs/104/darksteel-plate)'
			);
		});

		it('should return the final quote when Math.random returns a maximum value', () => {
			(Math.random as jest.Mock).mockReturnValue(0.99);

			const result = quoteGenerator();

			expect(result.name).toContain("Dinner and politics don't mix.");
		});
	});
});
