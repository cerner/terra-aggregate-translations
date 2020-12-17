const path = require('path');
const chalk = require('chalk');
const startCase = require('lodash.startcase');
const supportedLocales = require('../config/i18nSupportedLocales');

const createTranslationLoader = (loaderName, locale, format) => {
  if (format === 'es6') {
    return (
      `const ${loaderName} = (callback) =>
   import( /* webpackChunkName: "${locale}-translations" */ '${locale}.js')
     .then((module) => { callback(module);})
     .catch(error => console.log('An error occurred while loading ${locale}.js' + "\\n" + error));\n
`
    );
  }

  return (
    `var ${loaderName} = function ${loaderName}(callback) {
  return require.ensure([], function (require) {
    // eslint-disable-next-line
    var i18n = require('./${locale}.js').default;
    callback(i18n);
    return i18n;
  }, '${locale}-translations');
};\n
`
  );
};

const writeI18nLoaders = (locales, fileSystem, outputDir, format) => {
  const loaders = {};
  let loaderFile = "'use strict';\n\n";

  // Create the intl and translations loaders for each locale
  locales.forEach((locale) => {
    if (!supportedLocales.includes(locale)) {
      /* eslint-disable-next-line no-console */
      console.warn(chalk.yellow(`WARNING: ${locale} is NOT a Terra supported locale. Translation for ${locale} were not aggregated.`));
      return;
    }

    const localeLoaderName = startCase(locale).replace(' ', '');

    const loaderName = `load${localeLoaderName}Translations}`;
    loaders[`'${locale}'`] = loaderName;
    loaderFile += createTranslationLoader(loaderName, locale, format);
  });

  // Create the loader exports
  const loaderString = JSON.stringify(loaders, null, 2).replace(/"/g, '');
  loaderFile += `var translationsLoaders = ${loaderString};\n\nmodule.exports = translationsLoaders;`;

  // Write the loaders file
  const loaderPath = path.resolve(outputDir, 'translationsLoaders.js');
  fileSystem.writeFileSync(loaderPath, loaderFile);
};

module.exports = writeI18nLoaders;
