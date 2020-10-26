const path = require('path');
const chalk = require('chalk');
const startCase = require('lodash.startcase');
const supportedLocales = require('../config/i18nSupportedLocales');

const createIntlLoader = (loaderName, locale, format) => {
  if (format === 'es6') {
    return (
      `const ${loaderName} = () =>
   import('intl/locale-data/jsonp/${locale}.js')
   .catch(error => console.log('An error occurred while loading intl/locale-data/jsonp/${locale}.js' + "\\n" + error));\n
`
    );
  }

  return (
    `var ${loaderName} = function ${loaderName}() {
  return require.ensure([], function (require) {
    return require('intl/locale-data/jsonp/${locale}.js');
  }, '${locale}-intl-local');
};\n
`
  );
};

const creatRelativeTimeFormatLoader = (loaderName, locale, format) => {
  if (format === 'es6') {
    return (
      `const ${loaderName} = () =>
   import('@formatjs/intl-relativetimeformat/locale-data/${locale}.js')
   .catch(error => console.log('An error occurred while loading @formatjs/intl-relativetimeformat/locale-data/${locale}' + "\\n" + error));\n
`
    );
  }

  return (
    `var ${loaderName} = function ${loaderName}() {
  return require.ensure([], function (require) {
    return require('@formatjs/intl-relativetimeformat/locale-data/${locale}.js')
  }, 'relativetimeformat-${locale}-intl-local');
};\n
`
  );
};

const createTranslationLoader = (loaderName, locale, format) => {
  if (format === 'es6') {
    return (
      `const ${loaderName} = (callback, scope) =>
   import( /* webpackChunkName: "${locale}-translations" */ '${locale}.js')
     .then((module) => { callback.call(scope, module);})
     .catch(error => console.log('An error occurred while loading ${locale}.js' + "\\n" + error));\n
`
    );
  }

  return (
    `var ${loaderName} = function ${loaderName}(callback, scope) {
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

const writeLoaders = (type, locales, fileSystem, outputDir, format) => {
  const loaders = {};
  let loaderFile = "'use strict';\n\n";

  // Create the intl and translations loaders for each locale
  locales.forEach((locale) => {
    if (type === 'intl' && !supportedLocales.includes(locale)) {
      /* eslint-disable-next-line no-console */
      console.warn(chalk.yellow(`WARNING: ${locale} is NOT a Terra supported locale. Creating a translation and intl loader for ${locale}, but be sure the lanaguage specified is supported by intl and formatjs, otherwise no locale-data will exist and the import will result in an error.`));
    }

    const localeLoaderName = startCase(locale).replace(' ', '');

    if (type === 'intl') {
      loaders[`'${locale}'`] = {};

      const loaderName = `load${localeLoaderName}${startCase(type)}`;
      loaders[`'${locale}'`]['intl'] = loaderName;
      loaderFile += createIntlLoader(loaderName, locale, 'intl', format);

      // Some of our supported regional locales do not have locale data available for this polyfill
      if (!(locale === 'es-ES' || locale === 'fr-FR' || locale === 'pt-BR' || locale === 'sv-SE')) {
        const loaderName = `loadRelativeTimeFormat${localeLoaderName}${startCase(type)}`;
        loaders[`'${locale}'`]['relativetimeformat'] = loaderName;
        loaderFile += createRelativeTimeLoader(loaderName, locale, 'relativetimeformat', format);
      }
    } else {
      const loaderName = `load${localeLoaderName}${startCase(type)}`;
      loaders[`'${locale}'`] = loaderName;
      loaderFile += createTranslationLoader(loaderName, locale, format);
    }
  });

  // Create the loader exports
  const loaderString = JSON.stringify(loaders, null, 2).replace(/"/g, '');
  loaderFile += `var ${type}Loaders = ${loaderString};\n\nmodule.exports = ${type}Loaders;`;

  // Write the loaders file
  const loaderPath = path.resolve(outputDir, `${type}Loaders.js`);
  fileSystem.writeFileSync(loaderPath, loaderFile);
};

const writeI18nLoaders = (locales, fileSystem, outputDir, format) => {
  writeLoaders('intl', locales, fileSystem, outputDir, format);
  writeLoaders('translations', locales, fileSystem, outputDir, format);
};

module.exports = writeI18nLoaders;
