export declare class AwsS3Service {
    private storageService;
    private bucketName;
    constructor();
    uploadFile(filePath: string, file: any): Promise<string>;
    getFile(filePath: string): Promise<string>;
    deleteFile(filePath: string): Promise<string>;
}
