const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
	testEnvironment: 'node',
	transform: {
		...tsJestTransformCfg,
	},
	// Only run tests from src directory, exclude dist
	testMatch: ['**/src/**/*.test.ts', '**/src/**/__test__/**/*.ts', '**/src/**/__tests__/**/*.ts'],
	// Explicitly exclude dist and node_modules
	testPathIgnorePatterns: ['/node_modules/', '/dist/'],
	// Only collect coverage from src, not dist
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/**/*.test.ts',
		'!src/**/__test__/**',
		'!src/**/__tests__/**',
	],
};
