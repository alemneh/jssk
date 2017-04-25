'use strict';
const fs = require('fs');


function createState(info, options) {
  console.log('hit');
  var state = {
    userInfo: {

    }
  };

  state.userInfo = info;
  var filePath = __dirname + info.filePath + '.json';

  var json = JSON.stringify(state);
  fs.mkdir(__dirname + '/data', function(err) {
    if(err) throw err;
    fs.writeFile(filePath, json, 'utf8', (err) => {
      if (err) throw err;

      console.log('File saved!');
    });
  });

}


module.export = {
  createState: createState
};
