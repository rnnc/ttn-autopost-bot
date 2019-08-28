const fs = require('fs');

const { buildYTLink, isObjectEmpty } = require('./utils');
const { getLatestVideo } = require('./youtubeAPI');
const { postVideo } = require('./bot');

module.exports = function flow() {

  if (!fs.existsSync('./channels.json')) {
    console.log("channels.json doesn't exit");
    process.exit();
  }

  // let on purpose, so that same variable can be modified & reinserted into file
  let cacheData = JSON.parse(fs.readFileSync('./channels.json'));

  const { id, title } = cacheData[0].videoCache;

  getLatestVideo(cacheData[0].channelId)
    .then(async data => {

      // if there's no prev cache/older cache, write latest to cache
      if (isObjectEmpty(cacheData[0].videoCache) ||
        (new Date(data.publishedAt)) > (new Date(cacheData[0].videoCache.publishedAt))) {

        cacheData[0].videoCache = data;

        fs.writeFileSync('./channels.json', JSON.stringify(cacheData, null, 2));
        // post video if ids not the same or empty
        // presumed latest retrieved videoId is newest video
        console.log('Posting video\n')
        await postVideo(buildYTLink(data.id));
        return;
      }

      console.log(`Checked, no new video; not submitted anything`)

    })
    .catch(e => console.log(e))
    .finally(() => console.log('\nExiting\n_________\n'));

}

