'use strict';
const fs = require('fs');

module.export = {
  createState: createState
};

function createState(username, password) {
  var state = {
    arrary: []
  };
  state.username = username;
  state.password = password;
  state.arrary.push(username);
  state.arrary.push(password);
  var json = JSON.stringify(state);
  fs.writeFile('state.json', json, 'utf8', (err) => {
    if (err) throw err;

    console.log('File saved!');
  });
}
