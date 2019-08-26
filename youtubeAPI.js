const axios = require('axios');

const { YOUTUBE_API_KEY } = process.env;

module.exports.getLatestVideo = async (channelId) => {


  const rURI = buildRequestUrl(channelId);

  let reqData;

  try {
    reqData = (await axios.get(rURI)).data;
  } catch (e) {
    throw e.toJSON();
  }

  return parseData(reqData);
}

function buildRequestUrl(channelId) {

  return "https://www.googleapis.com/youtube/v3/search" +
    `?part=snippet&channelId=${channelId}&` +
    "maxResults=2&fields=items(id%2Csnippet(publishedAt%2Ctitle))" +
    `&key=${YOUTUBE_API_KEY}`;

}

function parseData(raw_data) {

  const { items } = raw_data;

  return {
    title: items[0].snippet.title,
    videoId: items[0].id.videoId,
    //link: `https://www.youtube.com/watch?v=${items[0].id.videoId}`
  }
}

