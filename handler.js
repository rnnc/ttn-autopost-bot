const fs = require('fs');

const { buildYTLink } = require('./utils');
const { getLatestVideo } = require('./youtubeAPI');
const { postVideo } = require('./bot');

module.exports = function flow() {

  if (!fs.existsSync('./channels.json')) {
    console.log("channels.json doesn't exit");
    process.exit();
  }

  let cacheData = JSON.parse(fs.readFileSync('./channels.json'));

  const { id, title } = cacheData[0].videoCache;

  getLatestVideo(cacheData[0].channelId)
    .then(async data => {
      // if there's no prev cache/different cache, write latest to cache
      if (id === "" || data.videoId !== id) {
        cacheData[0].videoCache = {
          id: data.videoId,
          title: data.title
        }
        fs.writeFileSync('./channels.json', JSON.stringify(cacheData, null, 2));

        // post video if ids not the same or empty
        // presumed latest retrieved videoId is newest video
        console.log('Posting video\n')
        await postVideo(buildYTLink(data.videoId));
        return;
      }

      console.log(`Checked, no new video; not submitted anything`)

    })
    .catch(e => console.log(e))
    .finally(() => console.log('Exiting\n_________\n'));

}
