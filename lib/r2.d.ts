export declare function getR2Client(): unknown;
export declare function getR2PublicBaseUrl(): string;
export declare function uploadToR2(
  key: string,
  body: Buffer | Uint8Array | ArrayBuffer | string,
  contentType?: string
): Promise<string>;