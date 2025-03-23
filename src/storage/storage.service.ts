import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
    private readonly logger = new Logger(StorageService.name);
    private readonly storage: Storage;
    private readonly bucketName: string;

    constructor(private readonly configService: ConfigService) {
        // You can configure these via environment variables or a config file
        const keyFilename = this.configService.get<string>(
            'GCP_CREDENTIALS_PATH',
            'C:/Users/Shirmil/Documents/SDGP/account-key.json'
        );
        const tempBucketName =  this.configService.get<string>('GCP_BUCKET_NAME');
        if (!tempBucketName){
            throw new Error("Error finding the BucketName");
        }
        this.bucketName = tempBucketName;

        // Initialize the Google Cloud Storage client
        this.storage = new Storage({ keyFilename });
    }

    async uploadFile(fileBytes: Buffer): Promise<string> {
        // Generate a unique file name to avoid collisions
        const fileName = uuidv4();
        const file = this.storage.bucket(this.bucketName).file(fileName);
        // Save the file to the bucket; no need to set the content type explicitly
        await file.save(fileBytes);
        // Return the file name for later use (e.g., saving in DB)
        return fileName;
    }

    async downloadFile(fileName: string): Promise<Buffer> {
        const file = this.storage.bucket(this.bucketName).file(fileName);
        const [exists] = await file.exists();
        if (!exists) {
            throw new Error(`File not found: ${fileName}`);
        }
        const [contents] = await file.download();
        return contents;
    }


    async getSignedUrl(fileName: string): Promise<string> {
        const file = this.storage.bucket(this.bucketName).file(fileName);
        const options = {
            version: 'v4' as const,
            action: 'read' as const,
            expires: Date.now() + 15 * 60 * 1000, // valid for 15 minutes
        };
        const [url] = await file.getSignedUrl(options);
        return url;
    }

    async deleteFile(fileName: string): Promise<void> {
        const file = this.storage.bucket(this.bucketName).file(fileName);
        await file.delete();
    }


    // You can add more methods (e.g. generateSignedUrl, deleteFile) following similar patterns.
}
