const path = require('path');
const chalk = require('chalk');
const fse = require('fs-extra');
const glob = require('glob');
const supportedLocales = require('../config/i18nSupportedLocales');

const aggregateMessages = require('./aggregate-messages');
const writeAggregatedTranslations = require('./write-aggregated-translations');
const writeI18nLoaders = require('./write-i18n-loaders');
const defaultSearchPatterns = require('../config/defaultSearchPatterns');

const isFile = filePath => (fse.existsSync(filePath) && !fse.lstatSync(filePath).isDirectory());

const loadConfigFile = (configPath) => {
  if (configPath) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(configPath);
  }

  const localPath = path.resolve(process.cwd(), 'terraI18n.config.js');
  if (isFile(localPath)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(localPath);
  }
  return {};
};

const defaults = (options = {}) => {
  const config = loadConfigFile(options.configPath);

  const defaultConfig = {
    baseDir: options.baseDir || config.baseDir || process.cwd(),
    directories: options.directories || config.directories || [],
    fileSystem: options.outputFileSystem || config.outputFileSystem || fse,
    locales: options.locales || config.locales || supportedLocales,
    outputDir: options.outputDir || './aggregated-translations',
    excludes: options.excludes || config.excludes || [],
    format: options.format || 'es5',
  };

  if (!defaultConfig.locales.includes('en')) {
    defaultConfig.locales.push('en');
  }

  return defaultConfig;
};

const aggregatedTranslations = (options) => {
  const {
    baseDir, directories, fileSystem, locales, outputDir, excludes, format,
  } = defaults(options);

  const searchPaths = [
    ...defaultSearchPatterns,
    ...directories,
  ];

  let translationDirectories = [];
  searchPaths.forEach((searchPath) => {
    translationDirectories = translationDirectories.concat(glob.sync(searchPath, { cwd: baseDir, ignore: excludes, follow: true }));
  });

  const context = chalk.bold.dim('[terra-aggregate-translations]');
  const localesText = chalk.bold.cyan(locales);
  /* eslint-disable-next-line no-console */
  console.log(chalk.grey(`${context} Aggregating translations for ${localesText} locales.`));

  // Aggregate translation messages for each of the translations directories
  const aggregatedMessages = aggregateMessages(translationDirectories, locales, fileSystem);

  const outputDirectory = path.resolve(baseDir, outputDir);
  fileSystem.mkdirpSync(outputDirectory);

  // Write aggregated translation messages to a file for each locale
  writeAggregatedTranslations(aggregatedMessages, locales, fileSystem, outputDirectory);

  // Write intl and translations loaders for the specified locales
  writeI18nLoaders(locales, fileSystem, outputDirectory, format);
};

module.exports = aggregatedTranslations;