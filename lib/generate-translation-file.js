const sortMessages = (messages) => {
  const sortedKeys = Object.keys(messages).sort((a, b) => {
    const lowerA = a.toLowerCase();
    const lowerB = b.toLowerCase();
    if (lowerA === lowerB) {
      return 0;
    }
    return lowerA < lowerB ? -1 : 1;
  });

  const sortedMessages = {};
  sortedKeys.forEach((messageKey) => {
    sortedMessages[messageKey] = messages[messageKey];
    return undefined;
  });
  return sortedMessages;
};

const translationFile = (messages) => (
  `'use strict';\n
Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = ${JSON.stringify(messages, null, 2)};
`);

const generateTranslationFile = (locale, messages) => {
  const sortedMessages = sortMessages(messages);
  return translationFile(sortedMessages);
};

module.exports = generateTranslationFile;
