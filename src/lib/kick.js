export const normalizeKickSlug = (input) =>
  String(input || '')
    .trim()
    .replace(/^https?:\/\/(www\.)?kick\.com\//i, '')
    .split(/[/?#]/)[0]
    .toLowerCase();

export const kickChannelUrl = (slug) => `https://kick.com/${encodeURIComponent(slug)}`;
export const kickPlayerUrl = (slug) => `https://player.kick.com/${encodeURIComponent(slug)}`;

export async function fetchKickChannel(slug) {
  try {
    const res = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(slug)}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      slug,
      displayName: data?.user?.username || slug,
      avatarUrl: data?.user?.profile_pic || '',
      followers: Number(data?.followers_count) || 0,
      isLive: Boolean(data?.livestream),
      viewers: Number(data?.livestream?.viewer_count) || 0,
      title: data?.livestream?.session_title || '',
      category: data?.livestream?.categories?.[0]?.name || '',
    };
  } catch {
    return null;
  }
}
