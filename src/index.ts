import { TwitterUtil } from './twitter.util'
import { CachUtil, CachData } from './cache.util';
import { DriveUtil } from './drive.util'

// befor auth
function doPost(e) {
  const properties = PropertiesService.getScriptProperties();
  const consumerKey = properties.getProperty('consumerKey');
  const consumerSecret = properties.getProperty('consumerSecret');
  const twitter:TwitterUtil = new TwitterUtil(consumerKey,consumerSecret);
  const imageId  = DriveUtil.write(e.parameter.imageBase64)
  const postData:CachData = {
    tweetText:e.parameter.tweetText,
    imageId: imageId
  }
  CachUtil.set(postData)
  return getRedirectPage(twitter.authorize())
}

// after auth
function authCallback(request){
  const properties = PropertiesService.getScriptProperties();
  const consumerKey = properties.getProperty('consumerKey');
  const consumerSecret = properties.getProperty('consumerSecret');
  const twitter:TwitterUtil = new TwitterUtil(consumerKey,consumerSecret);
  var isAuth = twitter.handleCallback(request);
  if( !isAuth ) return HtmlService.createHtmlOutput('login error');
  const { tweetText, imageId }:CachData = CachUtil.get()
  const imageBase64 = DriveUtil.read(imageId)
  console.log(tweetText)
  console.log(imageBase64)
  const ret = twitter.mediaUpload(imageBase64)
  const ret2 = twitter.tweetWithMedia(tweetText, ret["media_id_string"] )
  return HtmlService.createHtmlOutput('ツイートしました．この画面は閉じてください．');
}

function getRedirectPage(url){
  const html = '<script>top.location.href = "'+ url +'";</script>'
  return HtmlService.createHtmlOutput(html);
}

