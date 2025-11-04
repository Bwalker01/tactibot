import { footerGenerator } from '../footerGenerator';

describe('footerGenerator', () => {
	describe('basic functionality', () => {
		it('should return a string', () => {
			const result = footerGenerator();
			expect(typeof result).toBe('string');
			expect(result.length).toBeGreaterThan(0);
		});

		it('should return a string with the expected format', () => {
			const result = footerGenerator();
			// Format: "quote ~author | [card](link)"
			expect(result).toMatch(/.* ~.* \| \[.*\]\(.*\)/);
		});

		it('should include a quote, author, card, and link', () => {
			const result = footerGenerator();

			// Check for quote (text before ~)
			expect(result).toMatch(/^[^~]+/);

			// Check for author (between ~ and |)
			expect(result).toMatch(/~[^|]+/);

			// Check for card link (markdown format)
			expect(result).toMatch(/\[.*\]\(https:\/\/.*\)/);
		});
	});

	describe('quote selection', () => {
		it('should return different quotes on multiple calls (randomness)', () => {
			const results = new Set<string>();
			const iterations = 50;

			// Call footerGenerator multiple times to test randomness
			for (let i = 0; i < iterations; i++) {
				results.add(footerGenerator());
			}

			// With 6 quotes and 50 iterations, we should get at least 2 different quotes
			// This tests that the function is actually using randomness
			expect(results.size).toBeGreaterThan(1);
		});

		it('should be able to return any of the available quotes', () => {
			const allQuotes = [
				'If there can be no victory, then I will fight forever.',
				'You. Poet. Be sure to write this down.',
				'There is no knowledge that is not power.',
				"Don't just have an idea - have all of them.",
				"He didn't have a word for 'home', but he knew it was something to be defended.",
				'No life is without meaning. No living thing too small to be strong.',
			];

			const results: string[] = [];
			const iterations = 100;

			// Collect results from multiple calls
			for (let i = 0; i < iterations; i++) {
				results.push(footerGenerator());
			}

			// Check that at least one of each quote is present in the results
			// We check that all quotes can appear (not necessarily all in one run)
			allQuotes.forEach((quote) => {
				const found = results.some((result) => result.includes(quote));
				// With 100 iterations and 6 quotes, we should find each quote
				expect(found).toBe(true);
			});
		});
	});

	describe('output format validation', () => {
		it('should format quote with author correctly', () => {
			const result = footerGenerator();
			const parts = result.split(' ~');

			expect(parts.length).toBeGreaterThanOrEqual(2);

			const quote = parts[0]!;
			const authorAndLink = parts[1]!;

			expect(quote.length).toBeGreaterThan(0);
			expect(authorAndLink).toMatch(/.* \| \[.*\]\(.*\)/);
		});

		it('should format card link as markdown', () => {
			const result = footerGenerator();

			// Extract the markdown link part
			const linkMatch = result.match(/\[(.*?)\]\((.*?)\)/);

			expect(linkMatch).not.toBeNull();
			expect(linkMatch![1]).toBeTruthy(); // Card name
			expect(linkMatch![2]).toMatch(/^https:\/\/.*/); // Link starts with https://
		});

		it('should have all required components separated correctly', () => {
			const result = footerGenerator();

			// Split by the separators
			const hasTilde = result.includes(' ~');
			const hasPipe = result.includes(' | ');
			const hasMarkdownLink = /\[.*\]\(.*\)/.test(result);

			expect(hasTilde).toBe(true);
			expect(hasPipe).toBe(true);
			expect(hasMarkdownLink).toBe(true);
		});
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

			const result = footerGenerator();

			expect(result).toContain('If there can be no victory, then I will fight forever.');
			expect(result).toContain('Koth of the Hammer');
			expect(result).toContain('Darksteel Plate');
		});

		it('should return the last quote when Math.random returns close to 1', () => {
			// Math.random returns [0, 1), so floor(random * 6) for 6 quotes
			// To get index 5 (last quote), we need random >= 5/6 = 0.833...
			(Math.random as jest.Mock).mockReturnValue(0.99);

			const result = footerGenerator();

			expect(result).toContain(
				'No life is without meaning. No living thing too small to be strong.'
			);
			expect(result).toContain('Healer of the Pride');
		});

		it('should return a middle quote when Math.random returns a middle value', () => {
			// For index of 2, 0.4 * 6 = 2.4, floored is 2
			(Math.random as jest.Mock).mockReturnValue(0.4);

			const result = footerGenerator();

			expect(result).toContain('There is no knowledge that is not power.');
			expect(result).toContain('Enter the Infinite');
		});
	});

	describe('edge cases and consistency', () => {
		it('should consistently return valid output on multiple calls', () => {
			const results: string[] = [];

			for (let i = 0; i < 20; i++) {
				const result = footerGenerator();
				results.push(result);

				// Each result should be valid
				expect(typeof result).toBe('string');
				expect(result.length).toBeGreaterThan(0);
				expect(result).toMatch(/.* ~.* \| \[.*\]\(.*\)/);
			}

			// All results should be valid strings
			expect(results.every((r) => typeof r === 'string' && r.length > 0)).toBe(true);
		});

		it('should not return undefined or null', () => {
			for (let i = 0; i < 10; i++) {
				const result = footerGenerator();
				expect(result).not.toBeUndefined();
				expect(result).not.toBeNull();
			}
		});
	});
});
