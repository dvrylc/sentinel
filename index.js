#!/usr/bin/env node

// Imports
const chalk = require('chalk');
const fetch = require('node-fetch');
const fs = require('fs');
const ora = require('ora');
const os = require('os');
const strings = require('./strings');

// Chalk
const error = chalk.bold.red;
const green = chalk.green;

// Globals
let config;
const initTime = new Date();

function init() {
  // Attempt to read config file
  fs.readFile(`${__dirname}/config.json`, (err, data) => {
    if (err) {
      console.log(error(strings.noConfigError));
      process.exit(1);
    } else {
      // Parse config file
      config = JSON.parse(data);

      // Check that all sites have absolute URLs
      config.sites.forEach(site => {
        if (!site.startsWith('http')) {
          console.log(error(strings.noAbsoluteURLError));
          process.exit(1);
        }
      });

      // Check for an active Internet connection
      checkSite('http://www.google.com')
        .then(site => {
          if (site.up) {
            main()
          } else {
            console.log(error(strings.noConnectionError));
            process.exit(1);
          }
        });
    }
  });
}

function checkSite(site) {
  return fetch(site, { method: 'HEAD', timeout: config.timeout })
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
      console.log(green(`✔ ${site.url}`));
    } else {
      console.log(error(`✖ ${site.url}`));
    }
  });

  process.exit();
}

function main() {
  const spinner = ora('Checking sites').start();

  Promise.all(config.sites.map(site => checkSite(site)))
    .then(results => {
      const timeTaken = (new Date() - initTime) / 1000;
      spinner.succeed(`Checked ${results.length} ${results.length > 1 ? 'sites' : 'site'} in ${timeTaken} seconds`);

      displayResults(results);
    });
}

// Commander
const sentinel = require('commander');
sentinel
  .version('1.0.0')
  .description(`A command-line site monitor\n  Config file: ${os.homedir()}/config.json`)
  .parse(process.argv);

init();
