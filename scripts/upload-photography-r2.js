const path = require('path');
const fs = require('fs');

// Use scratch_upload node_modules for AWS S3 client
const nodeModulesPath = path.resolve(__dirname, '../scratch_upload/node_modules');
const { S3Client, HeadObjectCommand } = require(path.join(nodeModulesPath, '@aws-sdk/client-s3'));
const { Upload } = require(path.join(nodeModulesPath, '@aws-sdk/lib-storage'));
const mime = require(path.join(nodeModulesPath, 'mime-types'));

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const BUCKET_NAME = process.env.R2_BUCKET_NAME || "nore-media";
const PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL || "https://pub-c58cdc739b3e41f093d0676c704c7618.r2.dev";

const S3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

console.log("R2 Photography Uploader initialized for bucket:", BUCKET_NAME);
