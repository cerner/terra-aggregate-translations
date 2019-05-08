## Aggregate Translations Tool
This module provides the `aggregate-translations` pre-build tool to assist with creating the translation and loader files needed for nternationalized and localizatized Terra compoennts to render correctly.

 The `terra-aggregate-translations` pre-build tool will aggregate the translations, and create the intl loader and translation loader files that are configured for the specified locales. This tool is offered as a CLI script and as a setup function.

## How It Works
This script globs the specified translation directory regex pattern(s) to locate the translation directories. Then,
for each specified locale, the message-translation pairs from each translation json is extracted and added to the locale's message hash. When all messages have been extracted, the `aggregate-translations` script will create a single translation javascript file for each locale that exports the `messages` object, `areTranslationsLoaded` boolean and `locale` string. When a translation is missing for a region-specific locale, the message will fallback to the translation defined by the base locale. When a translation file is requested by terra-i18n's `I18nProvider`, this information is returned and used to provide the locale information.

Once all of the translation files are created for the specified locales, the script will create an intl loader and translation loader that is specific to the specified locales. This is utilized by the by terra-i18n's `I18nLoader` to load on-demand locale information.

### Order of Operations

* Start with [default search patterns](https://github.com/cerner/terra-aggregate-translations/blob/master/config/defaultSearchPatterns.js)
* Add any `custom directories` to the list of `default search patterns` to get an intermediate list of `directories to search`
* Filter out any directories provided in the `excludes` option from the intermediate list of `directories to search`

### `aggregate-translations` Options
| Option | CLI Option | Type | Description | Default |
|-|-|-|-|-|
| baseDir | -b, --baseDir | Path | Directory to search from and to prepend to the output directory. | current working directory |
| directories | -d, --directories | Array of Strings | Translation directory regex pattern(s) to glob, in addition to the default search patterns. | [ ] |
| excludes | -e, --excludes | Array of Strings | Translation directory regex pattern(s) to glob exclude from the search patterns. | [ ] |
| outputFileSystem | N/A | File System Module | The filesystem to use to write the translation and loader files. Note: The file system provide must support `mkdirp`. | [fs-extra](https://www.npmjs.com/package/fs-extra) |
| locales  | -l, --locales | Array of Strings | The list of locale codes to aggregate. **Note: 'en' is always added if not specified.** | [terra-supported locales](https://github.com/cerner/terra-core/blob/master/packages/terra-i18n/src/i18nSupportedLocales.js) |
| outputDir | -o, --ouputDir | String | Output directory for the translation and loader files | ./aggregated-translations |
| configPath | -c, --config | String | The path to the terra i18n configuration file | undefined |
| format | -f, --format | String | The format of syntax to output the translations with. Possible values are 'es5' and 'es6' | 'es5' |

#### Setup Example
The `aggregate-translations` setup function can be used as follows:
```js
// webpack config file
const aggregateTranslations = require('terra-aggregate-translations');

const aggregateOptions = {
    baseDir: __dirname,
    excludes: ['./node_modules/packageToExclude'],
    locales: ['en', 'en-US'],
    format: 'es6',
};

aggregateTranslations(aggregateOptions);

module.exports = // ...webpack config;
```

#### CLI Example
The `aggregate-translations` CLI is supplied as a bin script, called `tt-aggregate-translations`, and can be used as follows:
```js
scripts: {
    // ...other scripts
    "aggregate-translations": "tt-aggregate-translations -l ['en','es'] -e ./node_modules/packageToExclude",
    "start:build": "npm run aggregate-translations && npm run start"
}
```

#### terraI18n.config Example
Both the setup function and CLI methods allow for the configuration options to be loaded via a config file. The `aggregate-translations` tool will always attempt to load this config by default. If no config path is provided, the aggregate-translations tool will attempt to load the configuration from `./terraI18n.config.js`. If this file does not exist, the default configuration is used.

Add a terra-i18n config file like:
```js
module.exports = {
  locales: ['en', 'en-US'],
};
```

Then, to load the config someplace other than `./terraI18n.config.js`, simply add the config path as follows:
```js
// using setup approach
aggregateTranslations({ configPath: './config/terraI18n.config.js' });

// using CLI approach
"aggregate-translations": "tt-aggregate-translations -c ./config/terraI18n.config.js",
```

## Resolving Translations and Loaders
To provide the aggregated-translations files and loaders as modules to the terra-i18n component, the translated output directory must be supplied the webpack `resolve.modules` key before 'node_modules' resolution:
```js
 resolve: {
    modules: [path.resolve(__dirname, 'aggregated-translations'), 'node_modules'],
 },
```
This `resolve.modules` configuration indicates module resolving occurs in this order:
1. `./aggregated_translations` (or indicated output directory)
2. `./node_modules`

# Compiling with ES6 syntax.

The aggregate-translations script has the ability to compile with ES6 syntax by setting the format prop to 'es6'. To get these to work properly with Jest and the rest of your configuration, you need to add the [babel-plugin-syntax-dynamic-import](https://www.npmjs.com/package/babel-plugin-syntax-dynamic-import) plugin to your babel configuration. Since we are not using Babel 7 in Terra, you need to use version 6.18.0 to be compatible with our code base.

## Versioning

Terra-aggregate-translations is considered to be stable and will follow [SemVer](http://semver.org/) for versioning.
1. MAJOR versions represent breaking changes
2. MINOR versions represent added functionality in a backwards-compatible manner
3. PATCH versions represent backwards-compatible bug fixes

Consult the component CHANGELOGs, related issues, and PRs for more information.

## Contributing

Please read through our [contributing guidelines](CONTRIBUTING.md). Included are directions for issue reporting and pull requests.

## LICENSE

Copyright 2019 Cerner Innovation, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

&nbsp;&nbsp;&nbsp;&nbsp;http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
