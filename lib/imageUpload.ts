// Shared guardrails for admin image uploads (menu item photos → R2).
//
// Two things matter here beyond "does it look like an image":
// 1. Size — reject oversized uploads before they're read into memory/shipped to R2.
// 2. Type — never trust the client-supplied filename or Content-Type. Both are
//    attacker-controlled and would let something like an .html or .svg file
//    (which can carry a <script>) get stored with a browser-executable
//    Content-Type and served back from the public R2 URL. Instead we sniff the
//    actual file bytes (magic numbers) and only ever store one of a fixed set
//    of raster image types, with a server-chosen Content-Type — so whatever
//    ends up in the bucket can only ever be rendered as a static image, never
//    executed as a script/HTML.

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export type SniffedImageType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' | 'image/avif';

const EXTENSION_BY_TYPE: Record<SniffedImageType, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/gif':  'gif',
  'image/avif': 'avif',
};

export class ImageUploadError extends Error {}

/** Identify the image format from its magic bytes — ignores any client-supplied name/type. */
export function sniffImageType(buffer: Buffer): SniffedImageType | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 &&
    buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a
  ) {
    return 'image/png';
  }
  if (buffer.length >= 6 && buffer.toString('ascii', 0, 4) === 'GIF8') {
    return 'image/gif';
  }
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }
  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 4, 8) === 'ftyp' &&
    ['avif', 'avis'].includes(buffer.toString('ascii', 8, 12))
  ) {
    return 'image/avif';
  }
  return null;
}

/**
 * Validate an uploaded image: rejects anything over MAX_IMAGE_BYTES and
 * anything whose bytes don't match a known, safe raster image format.
 * Returns the sniffed content type and matching extension to use for
 * storage — never the client-supplied file.type or file.name.
 */
export function validateImageUpload(
  file: File,
  buffer: Buffer
): { contentType: SniffedImageType; extension: string } {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new ImageUploadError(`Image must be ${MAX_IMAGE_BYTES / (1024 * 1024)}MB or smaller`);
  }
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new ImageUploadError(`Image must be ${MAX_IMAGE_BYTES / (1024 * 1024)}MB or smaller`);
  }

  const contentType = sniffImageType(buffer);
  if (!contentType) {
    throw new ImageUploadError('Unsupported file — only JPEG, PNG, WEBP, GIF or AVIF images are allowed');
  }

  return { contentType, extension: EXTENSION_BY_TYPE[contentType] };
}

/** Random, extension-only key — never derived from a client-supplied filename. */
export function buildImageKey(prefix: string, extension: string): string {
  return `${prefix}/${crypto.randomUUID()}.${extension}`;
}
