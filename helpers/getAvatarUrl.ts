const AVATAR_BASE_URL = `https://api.dicebear.com/6.x/`;
const AVATAR_OPTIONS =
  '&mouth=smile,tongue,default,twinkle&eyes=happy,wink,surprised,default&style=circle';

export default function getAvatarUrl(seed: string, style: string) {
  const baseUrl = `${AVATAR_BASE_URL}${style}/png?seed=${seed ?? 'X'}`;
  if (style === 'initials') return baseUrl;
  return `${baseUrl}${AVATAR_OPTIONS}`;
}
