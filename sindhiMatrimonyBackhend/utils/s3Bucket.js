import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { logMessage } from "./globalFunction.js";

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION = "ap-south-1",
  AWS_S3_BUCKET_NAME = "sindhi-matrimony-assets",
  AWS_ENDPOINT_URL,
} = process.env;

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID || "MOCK_KEY",
    secretAccessKey: AWS_SECRET_ACCESS_KEY || "MOCK_SECRET",
  },
  ...(AWS_ENDPOINT_URL ? { endpoint: AWS_ENDPOINT_URL } : {}),
});

/**
 * Generate a secure direct-to-cloud presigned upload URL for Mobile App and Web
 */
export const getPresignedUploadUrl = async (folder = "profiles", fileExtension = "jpg", mimeType = "image/jpeg") => {
  try {
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;
    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: fileName,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutes
    const publicUrl = AWS_ENDPOINT_URL
      ? `${AWS_ENDPOINT_URL}/${AWS_S3_BUCKET_NAME}/${fileName}`
      : `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`;

    return { uploadUrl, publicUrl, key: fileName };
  } catch (error) {
    logMessage("Error generating presigned URL:", error, "error");
    throw error;
  }
};

/**
 * Delete a media object from S3 / R2 bucket
 */
export const deleteFileFromS3 = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: key,
    });
    return await s3Client.send(command);
  } catch (error) {
    logMessage("Error deleting file from S3:", error, "error");
    throw error;
  }
};
