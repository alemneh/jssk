#!/usr/bin/env node --harmony

'use strict';

var fs = require('fs');
var ProgressBar = require('progress');
var chalk = require('chalk');
var request = require('superagent');
var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');
var actions = require('./lib/actions');

program.arguments('<file>').option('-u, --username <username>', 'The user to authenticate as').option('-p, --password <password>', 'The user\'s password').action(function (file) {
  co(regeneratorRuntime.mark(function _callee() {
    var username, password, fileSize, fileStream, barOpts, bar;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return prompt('username: ');

          case 2:
            username = _context.sent;
            _context.next = 5;
            return prompt.password('password: ');

          case 5:
            password = _context.sent;

            actions.createState(username);
            fileSize = fs.statSync(file).size;
            fileStream = fs.createReadStream(file);
            barOpts = {
              width: 20,
              total: fileSize,
              clear: true
            };
            bar = new ProgressBar(' uploading [:bar] :percent :etas', barOpts);


            fileStream.on('data', function (chunk) {
              bar.tick(chunk.length);
            });

            request.post('https://api.bitbucket.org/2.0/snippets/').auth(username, password).attach('file', fileStream).set('Accept', 'application/json').end(function (err, res) {
              if (!err && res.ok) {
                var link = res.body.links.html.href;
                console.log(chalk.bold.cyan('Snippet created: ') + link);
                process.exit(0);
              }

              var errorMessage;
              if (res && res.status == 401) {
                errorMessage = 'Authenticate failed! Bad username/password?';
              } else if (err) {
                errorMessage = err;
              } else {
                errorMessage = res.text;
              }
              console.error(chalk.red(errorMessage));
              process.exit(1);
            });

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
}).parse(process.argv);