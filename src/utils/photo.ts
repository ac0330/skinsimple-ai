// On web, expo-camera's `base64` field is the full data URI (same as `uri`), not raw base64
// like on iOS/Android — this strips that prefix and reports the real image mime type.
export function extractBase64AndMimeType(photoBase64: string): {
  base64: string;
  mimeType?: string;
} {
  const dataUriMatch = photoBase64.match(/^data:(image\/\w+);base64,/);
  if (!dataUriMatch) {
    return { base64: photoBase64 };
  }
  return {
    base64: photoBase64.slice(dataUriMatch[0].length),
    mimeType: dataUriMatch[1],
  };
}
