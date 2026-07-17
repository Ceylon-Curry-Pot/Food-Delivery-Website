/* eslint-disable @typescript-eslint/no-require-imports */

const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');

let client;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

function getR2Client() {
  if (client) {
    return client;
  }

  const accountId = requireEnv('R2_ACCOUNT_ID');

  client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
    },
    forcePathStyle: true,
  });

  return client;
}

function getR2PublicBaseUrl() {
  const publicUrl = requireEnv('R2_PUBLIC_URL');
  return publicUrl.replace(/\/+$/, '');
}

function normalizeKey(key) {
  return key.replace(/^\/+/, '');
}

async function uploadToR2(key, body, contentType = 'application/octet-stream') {
  const cleanKey = normalizeKey(key);

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: requireEnv('R2_BUCKET_NAME'),
      Key: cleanKey,
      Body: body,
      ContentType: contentType,
    })
  );

  return `${getR2PublicBaseUrl()}/${cleanKey}`;
}

module.exports = {
  getR2Client,
  getR2PublicBaseUrl,
  uploadToR2,
};