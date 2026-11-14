export const ADMIN_EMAIL = 'zt.99.respect@gmail.com';
export const PAGE_SIZE = 10;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const DEFAULT_CONFIG = { maintenanceMode: false, announcement: '' };

export const isAdminEmail = (email) => (email || '').toLowerCase() === ADMIN_EMAIL;
