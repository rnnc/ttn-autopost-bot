require('dotenv').config();

const flow = require('./handler');

function outAndExit(name) {
  console.log(`ENV Variable ${name} is not defined\nExiting\n________\n`);
  process.exit();
}

function main() {

  console.log(`_________\n`);

  if (process.env.TTN_USER === undefined)
    outAndExit("TTN_USER");
  if (process.env.TTN_PASS === undefined)
    outAndExit("TTN_PASS");
  if (process.env.YOUTUBE_API_KEY === undefined)
    outAndExit("YOUTUBE_API_KEY");
  if (process.env.DEFAULT_TEIME === undefined)
    outAndExit("DEFAULT_TIME");

  setInterval(() => {

    console.log(`Check started :: ${new Date()}`);

    flow();

  }, process.env.DEFAULT_TIME);

}

main();