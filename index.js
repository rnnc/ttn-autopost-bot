require('dotenv').config();

const flow = require('./handler');

setInterval(() => {

  console.log(`_________\n\nCheck started :: ${new Date()}`);

  flow();

}, process.env.DEFAULT_TIME);