import commands from "./commands";

describe('Verify all commands:', () => {
    Object.entries(commands).forEach(([categoryName, category]) => {
        describe(`${categoryName}`, () => {
            Object.entries(category).forEach(([commandName, command]) => {
                describe(`${commandName}`, () => {
                it(`should have a valid definition`, () => {
                    expect(command.data.name).toBeDefined();
                    expect(command.data.description).toBeDefined();
                    expect(command.execute).toBeDefined();
                });

                it(`should follow the right format`, () => {
                    expect(command.data.name).toMatch(/[a-z]+/);
                    expect(command.data.description).toMatch(/[A-Z][a-zA-Z\s]+./);
                });
            });
            });
        });
    });
});