export interface CachData{
    tweetText:string
    imageId:string
}

export class CachUtil{

    static set(postData:CachData){
        CacheService.getUserCache().putAll(postData)
    }

    static get(): CachData{
        const postDatakeys = ['tweetText', 'imageId']
        const postData = CacheService.getUserCache().getAll(postDatakeys)
        return postData as CachData
    }
}
