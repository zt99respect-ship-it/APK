import { MAX_IMAGE_BYTES } from './constants.js';

const IMGBB_KEY = import.meta.env.VITE_IMGBB_KEY;

export const imageHostConfigured = Boolean(IMGBB_KEY);

export async function uploadImage(file) {
  if (!IMGBB_KEY) throw new Error('الخدمة غير مهيأة بعد');
  if (!file || !file.type.startsWith('image/')) throw new Error('الملف يجب أن يكون صورة');
  if (file.size > MAX_IMAGE_BYTES) throw new Error('حجم الصورة أكبر من 10 ميغابايت');

  const body = new FormData();
  body.append('image', file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: 'POST',
    body,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success || !json?.data?.url) throw new Error('فشل رفع الصورة');
  return json.data.url;
}
