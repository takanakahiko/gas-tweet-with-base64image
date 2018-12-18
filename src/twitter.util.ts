export class TwitterUtil {
  private service

  constructor(consumerKey: string, consumerSecret: string) {
    // @ts-ignore
    this.service = OAuth1.createService('twitter')
      .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
      .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
      .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')
      .setConsumerKey(consumerKey)
      .setConsumerSecret(consumerSecret)
      .setCallbackFunction('authCallback')
      .setCache(CacheService.getUserCache())
  }

  authorize(): string{
    const authorizationUrl = this.service.authorize()
    Logger.log('Open the following URL and re-run the script: %s', authorizationUrl)
    return authorizationUrl
  }

  handleCallback(e): boolean{
    return this.service.handleCallback(e)
  }

  hasToken(): boolean{
    return this.service.hasAccess()
  }

  tweetWithMedia(status: string, media_id:string): object{
    if ( !this.service.hasAccess()) throw Error('has no access')
    const url = 'https://api.twitter.com/1.1/statuses/update.json'
    const option:GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'post',
      payload: { status, media_ids:media_id }
    }
    const response = this.service.fetch(url, option)
    const result = JSON.parse(response.getContentText())
    Logger.log(JSON.stringify(result, null, 2))
    return result
  }

  mediaUpload(media_data: string): object{
    if ( !this.service.hasAccess()) throw Error('has no access')
    const url = 'https://upload.twitter.com/1.1/media/upload.json'
    const option:GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'post',
      payload: { media_data }
    }
    const response = this.service.fetch(url, option);
    const result = JSON.parse(response.getContentText());
    Logger.log(JSON.stringify(result, null, 2));
    return result
  }
}