const puppeteer = require('puppeteer');

//const chrome = require('chrome-aws-lambda');
//const puppeteer = require('puppeteer-core');

const {
  URL1, URL2,
  LOGIN_BUTTON, USERNAME_INPUT, PASSWORD_INPUT,
  LOGIN_SUBMIT, WAIT_SELECTOR_LOGIN,
  WAIT_SELECTOR_QUEUE, QUEUE_INPUT, QUEUE_VIDEO_SUBMIT,
  WAIT_SELECTOR_SUBMIT, QUEUE_VIDEO_FORM_SUBMIT
} = require('./constants');

//const { delay } = require('./utils');

module.exports.postVideo = async (video_url) => {

  console.log('Starting Up bot: Creating headless browser');

  const browser = await puppeteer.launch({
    /* args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless */
  });

  const page = await browser.newPage();

  // handler for alert boxes
  page.on('dialog', async dialog => {

    if (dialog.message() === "That video is already in the queue.")
      console.log(' ~ Video already in queue.');
    else
      console.log(` # Dialog popped up: \n # "${dialog.type()}:${dialog.message()}"`);

    await dialog.dismiss();
    await browser.close();
    console.log('Exiting\n_________\n');
  })

  // Go to page
  console.log(`Going to URL : ${URL1}`);
  await page.goto(URL1);
  await page.waitForSelector(LOGIN_BUTTON);

  // Login Sequence
  console.log('Logging In.....');
  await page.click(LOGIN_BUTTON);
  await page.type(USERNAME_INPUT, process.env.TTN_USER);
  await page.type(PASSWORD_INPUT, process.env.TTN_PASS);
  await page.click(LOGIN_SUBMIT);
  await page.waitForSelector(WAIT_SELECTOR_LOGIN);

  // Go to videos page, Insert Link (&/or Title) & submit
  console.log('Logged In');
  console.log(`Going to URL : ${URL2}`);
  await page.goto(URL2);
  await page.waitForSelector(WAIT_SELECTOR_QUEUE);
  console.log('Inserting video to queue');
  await page.type(QUEUE_INPUT, video_url);
  await page.click(QUEUE_VIDEO_SUBMIT);
  await page.waitForSelector(WAIT_SELECTOR_SUBMIT);
  await page.click('button[type="submit"]');

  // try catch here to prevent errors when 
  // handler catches video submitted alert & exits
  try {

    await page.waitForSelector(QUEUE_INPUT);
    // Exit
    console.log('Success');
    await browser.close();

  } catch (e) { console.log(" * Early Exit (most likely if video exists in queue) * ") }

}
