#!/usr/bin/env node --harmony
'use strict';
const fs = require('fs');
const ProgressBar = require('progress');
const chalk = require('chalk');
const request = require('superagent');
const co = require('co');
const prompt = require('co-prompt');
const program = require('commander');
const actions = require('./lib/actions');
const path = require('path');
const pkg = require('../package.json');
global.appRoot = path.resolve(__dirname);





program
  .version(pkg.version)
  .command('start <file name>')
  .description('List files and folders')
  .option('-a, --all', 'List all files and folders')
  .option('-l, --long','')
  .action(function(file, options) {
    co(function *() {
      console.log('Applicant Info:');
      var info = {};
      info.fullName = yield prompt('full name: ');
      info.email    = yield prompt('email: ');
      info.phoneNum = yield prompt('phone: ');
      info.filePath = file;
      console.log(info);
      var state = {
        userInfo: {

        }
      };

      state.userInfo = info;
      var filePath = __dirname + '/data/' + info.filePath + '.json';

      var json = JSON.stringify(state);
      fs.mkdir(__dirname + '/data', function(err) {
        if(err) throw err;
        fs.writeFile(filePath, json, 'utf8', (err) => {
          if (err) throw err;

          console.log('File saved!');
          process.exit(0);
        });
      });

    });
  });

program.parse(process.argv);

if (program.args.length === 0) program.help();
