export class DriveUtil{
    private static folderId = '1yjsRIcSwTiFvqFb8WXG_HLgiz4YN9PkV'

    static write(base64src:string){
        const drive = DriveApp.getFolderById(this.folderId);
        const contentType = 'image/png';
        const decoded = Utilities.base64Decode(base64src.replace(/^.*,/, ''))
        const blob = Utilities.newBlob(decoded, contentType, 'image.png') as any
        const file = drive.createFile(blob)
        return file.getId()
    }

    static read(fileid:string){
        const file = DriveApp.getFileById(fileid)
        return Utilities.base64Encode(file.getBlob().getBytes())
    }

}