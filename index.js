#!/usr/bin/env node
var contentful = require('contentful-management'),
  argv = require('yargs')
    .default('interval', 5000)
    .default('maxAmount', 10)
    .describe('managementToken', 'Mangment token to space API')
    .describe('space', 'Space id to work with')
    .describe('maxAmount', 'Contentul API limit')
    .describe('interval', 'Contentful API calls timeout')
    .describe('title', 'Title field in Entries (optional)')
    .describe('config', 'Configuration json file path')
    .help('h')
    .alias('h', 'help')
    .argv,
  config = {
    managementToken: argv.managementToken,
    space: argv.space,
    interval: argv.interval,
    maxAmount: argv.maxAmount,
    title: argv.title
  },
  log = console.log.bind(console),
  space;

if (argv.config) {
  config = require(argv.config);
}

log('Connecting to Contentful');
contentful.createClient({
  accessToken: config.managementToken
}).
getSpace(config.space).
then(function(_space_) {
  space = _space_;
  log('Connected to space: ', space.name);
  return space.getPublishedEntries({
    include: 1,
    limit: config.maxAmount
  });
}).
then(function(entries) {
  log('Extracted entries: ', entries.length);
  return deleteEntry(entries.shift(), entries);
}).
then(function() {
  log('Your space is clean!');
  process.exit();
}).
catch(function(error) {
  log(error);
  process.exit();
});

function deleteEntry(entry, list) {
  var fields = entry.fields,
    identifier = fields[config.title] || {};

  identifier = identifier['en-US'] || entry.sys.id;
  log('---Deleting entry:', identifier);

  return space.unpublishEntry(entry).
    then(function(unpublishedEntry) {
      log('Entry unpublished:', identifier);
      return space.deleteEntry(unpublishedEntry);
    }).
    then(function(err) {
      log('Entry deleted: ', identifier, err || '');
      if (err) {
        return Promise.reject();
      }

      if (list.length == 0) {
        return Promise.resolve();
      }

      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve(deleteEntry(list.shift(), list));
        }, config.interval);
      });
    }).
    catch(function(error) {
      log('Failed to delete entry: ', identifier);
      log(error);
      return Promise.reject();
    });
}
