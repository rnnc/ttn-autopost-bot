/** 
 * for puppeteer instance, delay in next action execution, default is 2500ms
 * @param {Number} timeout milliseconds for timeout, 2500ms is default
*/
module.exports.delay = (timeout = 2500) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  })
}

/**
 * builds youtube link from videoId
 * @param {String} videoId videoId of youtube video
 * @return {String} youtube link for submission
 */
module.exports.buildYTLink = (videoId) => {
  if (videoId === "" || videoId === null)
    throw "(Build YTLink) VideoId empty";

  return `https://www.youtube.com/watch?v=${videoId}`;
}

/** 
 * checks if object is empty
 * @param {Object} obj Object
 * @return {Boolean} isempty or not
*/
module.exports.isObjectEmpty = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}