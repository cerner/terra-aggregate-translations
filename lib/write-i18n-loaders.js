const path = require('path');
const chalk = require('chalk');
const startCase = require('lodash.startcase');
const supportedLocales = require('../config/i18nSupportedLocales');


const createTranslationLoader = (loaderName, locale, format) => {
  if (format === 'es6') {
    return (
      `const ${loaderName} = (callback) =>
   import( /* webpackChunkName: "${locale}-translations" */ '${locale}.js')
     .then((module) => { callback(module.default);})
     .catch(error => console.log('An error occurred while loading ${locale}.js' + "\\n" + error));\n
`
    );
  }

  return (
    `var ${loaderName} = function ${loaderName}(callback) {
  return require.ensure([], function (require) {
    // eslint-disable-next-line
    var i18n = require('./${locale}.js');
    callback.call(scope, i18n);
    return i18n;
  }, '${locale}-translations');
};\n
`
  );
};

const writeLoaders = (locales, fileSystem, outputDir, format) => {
  const loaders = {};
  let loaderFile = "'use strict';\n\n";

  // Create the intl and translations loaders for each locale
  locales.forEach((locale) => {
    const localeLoaderName = startCase(locale).replace(' ', '');
    const loaderName = `load${localeLoaderName}${startCase(type)}`;
    loaders[`'${locale}'`] = loaderName;
    loaderFile += createTranslationLoader(loaderName, locale, format);
  });

  // Create the loader exports
  const loaderString = JSON.stringify(loaders, null, 2).replace(/"/g, '');
  loaderFile += `var ${type}Loaders = ${loaderString};\n\nmodule.exports = ${type}Loaders;`;

  // Write the loaders file
  const loaderPath = path.resolve(outputDir, `${type}Loaders.js`);
  fileSystem.writeFileSync(loaderPath, loaderFile);
};

const writeI18nLoaders = (locales, fileSystem, outputDir, format) => {
  writeLoaders(locales, fileSystem, outputDir, format);
};

module.exports = writeI18nLoaders;
