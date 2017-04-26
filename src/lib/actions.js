'use strict';
const fs = require('fs');
const co = require('co');
const prompt = require('co-prompt');



function createState(file, options) {
  co(function *() {
    console.log('Applicant Info:');
    console.log(file);
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
    console.log(__dirname);
    state.userInfo = info;
    var filePath =  __dirname + '/../data/' + info.filePath + '.json';
    console.log(state);
    var json = JSON.stringify(state, null, 4);
    console.log(json);
    fs.mkdir(__dirname + '/../data', function(err) {
      if(err) throw err;
      fs.writeFile(filePath, json, 'utf8', (err) => {
        if (err) throw err;

        console.log('File saved!');
        process.exit(0);
      });
    });

  });
}


module.exports = {
  createState: createState
};
