const fs = require('fs');
const path = require('path');
const aggregateMessages = require('../../lib/aggregate-messages');

global.console = { warn: jest.fn() };

const translationDirectories = [
  path.resolve(__dirname, 'fixtures', 'translations'),
  path.resolve(__dirname, 'fixtures', 'ned_modules', 'fixtures1', 'translations'),
];
const locales = ['en', 'en-US', 'es'];
const fileSystem = fs;

const expectedMessages = {
  'Terra.fixtures.test': 'Test...',
  'Terra.fixtures1.test': 'Test...',
};

describe('aggregates translations messages', () => {
  it('returns empty messages when no translations directories are provided', () => {
    const messages = aggregateMessages([], locales, fileSystem);

    expect(messages).toHaveProperty('en', {});
    expect(messages).toHaveProperty('en-US', {});
    expect(messages).toHaveProperty('es', {});
  });

  it('logs a warning message if a translation file is not found', () => {
    aggregateMessages([__dirname], ['en'], fileSystem);

    // eslint-disable-next-line no-console
    expect(console.warn).toBeCalled();
  });

  it('aggregates the messages', () => {
    const messages = aggregateMessages(translationDirectories, locales, fileSystem);

    expect(messages).toHaveProperty('en', expectedMessages);
    expect(messages).toHaveProperty('en-US', expectedMessages);
    expect(messages).toHaveProperty('es', expectedMessages);
  });
});