const axios = require('axios');

const { YOUTUBE_API_KEY } = process.env;

module.exports.getLatestVideo = async (channelId) => {
  const upListURI = buildChannelUploadPlaylistURL(channelId);

  let uploadPlaylistId;

  // gets upload playlistId of the channel first
  try {
    const reqData = (await axios.get(upListURI)).data.items[0];
    uploadPlaylistId = reqData.contentDetails.relatedPlaylists.uploads;
  } catch (e) { throw `\nYT Axios Request Error (Channel Upload Playlist URL)\n${e.json}` };

  const upVidURI = buildLatestUploadURL(uploadPlaylistId);

  // gets latest video in upload playlist of channel
  // and parses data to be returned
  try {
    const { snippet, contentDetails } = (await axios.get(upVidURI)).data.items[0];

    return ({
      id: contentDetails.videoId,
      title: snippet.title,
      publishedAt: snippet.publishedAt
    });

  } catch (e) { throw `\nYT Axios Request Error (Latest Upload URL)\n${e.json}` };

}


function buildLatestUploadURL(uploadPlaylistId) {
  return `https://www.googleapis.com/youtube/v3/playlistItems` +
    `?part=snippet%2CcontentDetails&maxResults=1&fields=items(contentDetails%2FvideoId%2Csnippet(publishedAt%2Ctitle))` +
    `&playlistId=${uploadPlaylistId}` +
    `&key=${YOUTUBE_API_KEY}`
}

function buildChannelUploadPlaylistURL(channelId) {

  return `https://www.googleapis.com/youtube/v3/channels`
    + `?part=contentDetails&id=${channelId}`
    + `&key=${YOUTUBE_API_KEY}`;

  // for dynamic selection of either channel name or channel id
  
  /* return `https://www.googleapis.com/youtube/v3/channels`
    + `?part=contentDetails&${() => {

      if (nameIdObj.name)
        return `forUsername=${nameIdObj.name}`
      if (nameIdObj.id)
        return `id${nameIdObj.id}`
      else
        throw 'nameIdObj undefined';

    }}`
    + `&key=${YOUR_API_KEY}`; */
  
   // https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=UCbpMy0Fg74eXXkvxJrtEn3w&key=AIzaSyB8fYs_uKcetymiP-h6FLwnuYR0JnnK2JE
}