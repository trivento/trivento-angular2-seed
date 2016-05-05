#!/bin/env node
var loki = require('lokijs');

var LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, ' +
  'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ' +
  'nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in ' +
  'reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla ' +
  'pariatur. Excepteur sint occaecat cupidatat non proident, sunt in ' +
  'culpa qui officia deserunt mollit anim id est laborum.';

var db = new loki('db.json', {autosave: true});

var note = db.addCollection('note');
for (var i = 1; i < 11; i++) {
  note.insert({id: i, title: 'Note ' + i, text: LOREM});
}

db.save(function() {
  process.exit();
});
