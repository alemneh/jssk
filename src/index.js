#!/usr/bin/env node --harmony
import fs from 'fs';
import ProgressBar from 'progress';
import chalk from 'chalk';
import request from 'superagent';
import co from 'co';
import prompt from 'co-prompt';
import program from 'commander';
import actions from './lib/actions';
import path from 'path';
global.appRoot = path.resolve(__dirname);





program
  .arguments('<file>')
  .option('-u, --username <username>', 'The user to authenticate as')
  .option('-p, --password <password>', 'The user\'s password')
  .action(function(file) {
    co(function *() {
      var username = yield prompt('username: ');
      var password = yield prompt.password('password: ');
      actions.createState(username);
      var fileSize = fs.statSync(file).size;
      var fileStream = fs.createReadStream(file);
      var barOpts = {
        width: 20,
        total: fileSize,
        clear: true
      };
      var bar = new ProgressBar(' uploading [:bar] :percent :etas', barOpts);

      fileStream.on('data', function(chunk) {
        bar.tick(chunk.length);
      });

      request
        .post('https://api.bitbucket.org/2.0/snippets/')
        .auth(username, password)
        .attach('file', fileStream)
        .set('Accept', 'application/json')
        .end(function (err, res) {
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
    });

  })
  .parse(process.argv);
