#!/usr/bin/env node

// Imports
const chalk = require('chalk');
const fetch = require('node-fetch');
const fs = require('fs');
const ora = require('ora');
const os = require('os');
const yesno = require('yesno');

// Chalk
const error = chalk.bold.red;
const success = chalk.bold.green;

// Strings
const strings = {
  "setupConfigCopied": `Config file created at ${os.homedir()}/.sentinel, edit this file for your desired config.`,
  "setupConfigExists": `A config file already exists, do you want to overwrite it with the default? (y/n)`,
  "initConnectionCheck": "Checking for an active Internet connection",
  "initConnectionError": "✖ No active Internet connection found.",
  "initNoConfigError": `✖ No config file found, run \`sentinel -s\` to setup.`,
  "initAbsoluteURLError": `✖ Config contains non-absolute URLs, make sure all URLs are absolute (http or https) then try again.`
}

// Functions
function setup() {
  // Check if config file already exists
  fs.readFile(`${os.homedir()}/.sentinel`, (err, _) => {
    if (!err) {
      // Config file already exists, ask if user wants to overwrite with default
      yesno.ask(strings.setupConfigExists, null, overwrite => {
        overwrite ? setupCopy() : process.exit();
      });
    } else {
      setupCopy();
    }
  });
}

function setupCopy() {
  // Copy default config file to user's home directory
  fs.copyFile(`${__dirname}/config.json`, `${os.homedir()}/.sentinel`, err => {
    console.log(success(strings.setupConfigCopied));
    process.exit();
  });
}

function init() {
  let config;

  // Attempt to read config file
  fs.readFile(`${os.homedir()}/.sentinel`, (err, data) => {
    if (err) {
      // No config file found
      console.log(error(strings.initNoConfigError));
      process.exit(1);
    } else {
      // Parse config file
      config = JSON.parse(data);

      // Check that all sites have absolute URLs
      config.sites.forEach(site => {
        if (!site.startsWith('http')) {
          console.log(error(strings.initAbsoluteURLError));
          process.exit(1);
        }
      });

      // Check for an active Internet connection
      const spinner = ora(strings.initConnectionCheck).start();
      checkSite('http://www.google.com')
        .then(site => {
          spinner.stop();

          if (site.up) {
            main(config);
          } else {
            console.log(error(strings.initConnectionError));
            process.exit(1);
          }
        });
    }
  });
}

function main(config) {
  const startTime = new Date();
  const spinner = ora('Checking sites').start();

  Promise.all(config.sites.map(site => checkSite(site)))
    .then(results => {
      const timeTaken = (new Date() - startTime) / 1000;
      spinner.succeed(`Checked ${results.length} ${results.length > 1 ? 'sites' : 'site'} in ${timeTaken} seconds`);

      displayResults(results);
    });
}

function checkSite(site) {
  return fetch(site, { method: 'HEAD' })
    .then(r => {
      return {
        url: site,
        up: true
      }
    })
    .catch(e => {
      return {
        url: site,
        up: false
      }
    });
}

function displayResults(results) {
  results.forEach(site => {
    if (site.up) {
      console.log(chalk.green(`✔ ${site.url}`));
    } else {
      console.log(error(`✖ ${site.url}`));
    }
  });

  process.exit();
}

// Commander
const sentinel = require('commander');
sentinel
  .version(require(`${__dirname}/package.json`).version)
  .description(`A command-line site monitor\n  Config file: ${os.homedir()}/.sentinel`)
  .option('-s, --setup', 'setup config file in the home directory')
  .parse(process.argv);

if (sentinel.setup) {
  setup();
} else {
  init();
}
