import * as Localization from 'expo-localization';

export default function formatDate(dateString: string | null) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const locale = Localization.getLocales()[0].languageTag || 'en-AU';
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
