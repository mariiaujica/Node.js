
'use strict';

// TODO: Write the homework code in this file
const fs = require('fs');
const http = require('http');

const DEFAULT_ENCODING = 'utf8';
const STORE_FILE_NAME = 'store.txt';
let myWriteStream = fs.createWriteStream('store.json');
let data = fs.readFileSync('store.json');
const myObject = JSON.parse(data);
let items = [];

function readFile() {
  let myReadStream = fs.createReadStream('store.json', DEFAULT_ENCODING);
  myReadStream.on('data', function(chunks) {
    console.log(`\nTo-Dos:\n${chunks}`);
    items.push(chunks);
    console.log(chunks);
  });
}

function appendFile(stream, ...text) {
  return new Promise((resolve, reject) => {
    try {
      myObject.push(text);
      let newData = JSON.stringify(myObject);
      console.log(`${text} added to ToDo list`);

      stream.write(`${newData}`);
      readFile();
      resolve('STREAM_WRITE_SUCCESS');
    }
    catch (streamError) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('STREAM_WRITE_FAILURE', streamError);
    }
  });
};

function updateFile(index, ...text) {
  const todo = fs.readFileSync(STORE_FILE_NAME, DEFAULT_ENCODING).split('\n');
  // console.log(text);
  let element = '';
  if (index >= 0 && index < text.length) {
    const item = todo[index];
    for (let i = 1; i < text.length; i++) {
      element += `${text[i]} `;
    }
    const updatedText = element;

    todo.splice(index, 1);
    todo.splice(index, 0, `${updatedText}`);
    const newData = todo.join('\n');
    fs.writeFileSync(STORE_FILE_NAME, newData, {
      encoding: DEFAULT_ENCODING
    });
    console.log(`Successfully updated item: ${item} to ${updatedText}`);
  }
}

function removeFile(index) {
  const todo = fs.readFileSync('store.json', DEFAULT_ENCODING).split('\n');
  if (index >= 0 && index < todo.length) {
    const item = todo[index];
    todo.splice(index, 1);
    const newData = todo.join('\n');
    fs.writeFileSync(STORE_FILE_NAME, newData, {
      encoding: DEFAULT_ENCODING
    });
    console.log(`Removed entry ${item}`);
  }
};

function resetFile() {
  fs.unlinkSync(STORE_FILE_NAME);

  fs.open(STORE_FILE_NAME, 'w', function(err, data) {
    if (err) throw err;
    console.log('Reset of File Successful!');
  });
}

function printHelp() {
  console.log(`
Options:

  list          read all to-dos
  add           add to-do
  update        updates item on specific location
  remove        removes specific entry at specific location
  reset         resets file with removing all previous data
  help          show this help text
  `);
}

const cmd = process.argv[2];
const args = process.argv.slice(3);
const index = parseInt(args[0]) - 1;
// const updateText = (args[1]);

switch (cmd) {
  case 'list':
    readFile();
    break;

  case 'add':
    appendFile(myWriteStream, ...args);
    // .then(() => console.log('Wrote to-do to file'))
    // .then(() => readFile())
    // .then(data => console.log(`\nTo-Dos:\n${data}`))
    // .catch(console.error);
    break;

  case 'remove':
    removeFile(index);
    break;

  case 'reset':
    resetFile();
    break;

  case 'update':
    updateFile(index, ...args);
    break;
  case 'help':
  default:
    printHelp();
    break;
}
