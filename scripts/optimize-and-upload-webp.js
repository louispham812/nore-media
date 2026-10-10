const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const BUCKET = process.env.R2_BUCKET_NAME || "nore-media";
const PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL || "https://pub-c58cdc739b3e41f093d0676c704c7618.r2.dev";

const S3 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const jsonPath = path.resolve(__dirname, '../src/data/photography.json');
const photographyData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const localBaseDir = 'D:/Users/Downloads/New folder (2)/Sản phẩm dự án_/Photography & Tài nguyên';

async function getImageBuffer(img) {
  // Try local mapping first
  const parts = img.key.split('/');
  const catFolderMap = {
    'Product': '1. Product (Sản phẩm)',
    'Brand': '2. Brand (Thương hiệu)',
    'CaNhan': '3. Cá nhân (Chân dung & Lookbook)'
  };

  const localCat = catFolderMap[parts[1]];
  const localFolder = parts[2];
  const localFile = parts[3];

  if (localCat && localFolder && localFile) {
    const localCandidate = path.join(localBaseDir, localCat, localFolder, localFile);
    if (fs.existsSync(localCandidate)) {
      return fs.readFileSync(localCandidate);
    }
  }

  // Fallback: fetch from R2 via public URL
  console.log(`[R2 Fetch] Fetching original from R2: ${img.url}`);
  const response = await fetch(img.url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from R2: ${img.url} (status: ${response.status})`);
  }
  const arrayBuf = await response.arrayBuffer();
  return Buffer.from(arrayBuf);
}

async function processAll() {
  console.log('Starting optimization of 45 photography images...');
  let processedCount = 0;
  let totalOrigBytes = 0;
  let totalThumbBytes = 0;
  let totalLargeBytes = 0;

  for (const category of photographyData) {
    for (const subcategory of category.subcategories) {
      for (const img of subcategory.images) {
        processedCount++;
        console.log(`\n[${processedCount}/45] Processing: ${img.title}`);
        
        const origBuffer = await getImageBuffer(img);
        totalOrigBytes += origBuffer.length;
        console.log(`  Original size: ${(origBuffer.length / 1024 / 1024).toFixed(2)} MB`);

        // Generate thumb (900px max, quality 80)
        const thumbBuffer = await sharp(origBuffer)
          .resize({ width: 900, withoutEnlargement: true })
          .webp({ quality: 80, effort: 4 })
          .toBuffer();
        totalThumbBytes += thumbBuffer.length;
        console.log(`  Thumb WebP: ${(thumbBuffer.length / 1024).toFixed(1)} KB`);

        // Generate large (2000px max, quality 85)
        const largeBuffer = await sharp(origBuffer)
          .resize({ width: 2000, withoutEnlargement: true })
          .webp({ quality: 85, effort: 4 })
          .toBuffer();
        totalLargeBytes += largeBuffer.length;
        console.log(`  Large WebP: ${(largeBuffer.length / 1024).toFixed(1)} KB`);

        // Construct keys
        const ext = path.extname(img.key);
        const basePath = img.key.slice(0, -ext.length);
        const thumbKey = `${basePath}_thumb.webp`;
        const largeKey = `${basePath}_large.webp`;

        // Upload thumb
        await S3.send(new PutObjectCommand({
          Bucket: BUCKET,
          Key: thumbKey,
          Body: thumbBuffer,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable',
        }));

        // Upload large
        await S3.send(new PutObjectCommand({
          Bucket: BUCKET,
          Key: largeKey,
          Body: largeBuffer,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable',
        }));

        // Update JSON references
        img.url = `${PUBLIC_BASE_URL}/${largeKey}`;
        img.thumbUrl = `${PUBLIC_BASE_URL}/${thumbKey}`;
        img.key = largeKey;
        img.thumbKey = thumbKey;

        console.log(`  Uploaded to R2:`);
        console.log(`    thumb: ${thumbKey}`);
        console.log(`    large: ${largeKey}`);
      }
    }
  }

  // Save updated JSON
  fs.writeFileSync(jsonPath, JSON.stringify(photographyData, null, 2), 'utf8');
  console.log('\n=============================================');
  console.log('SUCCESSFULLY OPTIMIZED ALL 45 IMAGES!');
  console.log(`Original total size: ${(totalOrigBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized thumb total: ${(totalThumbBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized large total: ${(totalLargeBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total saved for grid: ${((1 - totalThumbBytes / totalOrigBytes) * 100).toFixed(1)}% reduction!`);
  console.log('Updated src/data/photography.json successfully.');
}

processAll().catch(err => {
  console.error('Fatal error during optimization:', err);
  process.exit(1);
});
