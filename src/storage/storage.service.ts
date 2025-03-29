import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Import Cloudinary's v2 API
import { v2 as cloudinary } from 'cloudinary';
// Import streamifier to convert a Buffer into a stream for upload
import * as streamifier from 'streamifier';
// Import axios to download file data from a URL
import axios from 'axios';

@Injectable()
export class StorageService {
    private readonly logger = new Logger(StorageService.name);

    constructor(private readonly configService: ConfigService) {
        // Get Cloudinary credentials from environment variables
        const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
        const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
        const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

        // Check if all necessary credentials are provided
        if (!cloudName || !apiKey || !apiSecret) {
            throw new Error("Cloudinary credentials are not set in the configuration.");
        }

        // Configure Cloudinary with the provided credentials
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });

        this.logger.log("Cloudinary configured successfully.");
    }

    /**
     * uploadFile: Accepts a file in Buffer format and uploads it to Cloudinary.
     * Returns a Promise that resolves to a string identifier (public_id).
     * This public_id is used later to generate a download URL.
     */
    async uploadFile(fileBytes: Buffer): Promise<string> {
        return new Promise((resolve, reject) => {
            // Create a stream to upload the file to Cloudinary
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto', // Automatically detect the file type (image, video, etc.)
                },
                (error, result) => {
                    if (error) {
                        this.logger.error("Error uploading file to Cloudinary", error);
                        return reject(error);
                    }
                    // Resolve with the public_id which acts as our file name/identifier
                    if (!result) throw  new Error("Error uploading uploading the image")


                    resolve(result.public_id);
                }
            );
            // Convert the Buffer to a stream and pipe it to Cloudinary
            streamifier.createReadStream(fileBytes).pipe(uploadStream);
        });
    }

    /**
     * downloadFile: Given a file identifier (public_id), this method generates a URL
     * and uses it to download the file as a Buffer.
     */
    async downloadFile(fileName: string): Promise<Buffer> {
        // Generate a secure URL to access the file from Cloudinary
        const url = cloudinary.url(fileName, {secure: true, resource_type: 'auto'});
        try {
            // Fetch the file data as an arraybuffer
            const response = await axios.get(url, {responseType: 'arraybuffer'});
            // Convert the response data to a Buffer and return it
            return Buffer.from(response.data, 'binary');
        } catch (error) {
            this.logger.error(`Error downloading file ${fileName} from Cloudinary`, error);
            throw new Error(`File not found or unable to download: ${fileName}`);
        }
    }

    /**
     * getSignedUrl: Returns a secure URL that can be used to download the file.
     * The URL is signed and set to expire after 15 minutes.
     *
     * Note: Cloudinary supports generating signed URLs for authenticated access.
     * This option is only effective if your Cloudinary account is set to require
     * signed URLs for access.
     */
    async getSignedUrl(fileName: string): Promise<string> {
        // Calculate the expiration time (15 minutes from now in seconds)
        const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60;
        // Generate a secure URL with signing and an auth token that expires after 15 minutes
        const url = cloudinary.url(fileName, {
            secure: true,
            resource_type: 'auto',
            sign_url: true,
            auth_token: {
                expires_at: expiresAt,
            },
        });
        return url;
    }

    /**
     * deleteFile: Deletes the file from Cloudinary using its identifier (public_id).
     */
    async deleteFile(fileName: string): Promise<void> {
        try {
            // Use Cloudinary's destroy method to remove the file
            await cloudinary.uploader.destroy(fileName, {resource_type: 'auto'});
        } catch (error) {
            this.logger.error(`Error deleting file ${fileName} from Cloudinary`, error);
            throw new Error(`Unable to delete file: ${fileName}`);
        }
    }
}