export const POST_IMAGE_BUCKET = 'post-images';

/**
 * 공개 이미지 URL에서 Storage 내부 경로를 추출
 * 예) https://.../post-images/{uid}/123.png → {uid}/123.png
 */
export function getStoragePath(publicUrl) {
  if (!publicUrl) {
    return null;
  }
  const [, path] = publicUrl.split(`/${POST_IMAGE_BUCKET}/`);
  return path ? decodeURIComponent(path) : null;
}
