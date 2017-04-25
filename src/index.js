#!/usr/bin/env node --harmony
'use strict';
const fs = require('fs');
const ProgressBar = require('progress');
const chalk = require('chalk');
const request = require('superagent');
const program = require('commander');
const actions = require('./lib/actions');
const path = require('path');
const pkg = require('../package.json');
global.appRoot = path.resolve(__dirname);
console.log(actions);





program
  .version(pkg.version)
  .command('start <file name>')
  .description('List files and folders')
  .option('-a, --all', 'List all files and folders')
  .option('-l, --long','')
  .action(actions.createState);

program.parse(process.argv);

if (program.args.length === 0) program.help();
