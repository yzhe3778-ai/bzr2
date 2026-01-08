
export type ThemeStyle = 'classic' | 'zootopia' | 'spongebob' | 'demon-slayer' | 'minions' | 'harry-potter';

export interface CommentData {
  badgeTitle: string;
  content: string;
  signOff: string;
}

export interface ThemeConfig {
  id: ThemeStyle;
  name: string;
  icon: string;
  bgColor: string;
  accentColor: string;
  textColor: string;
  borderColor: string;
  cardBg: string;
  fontClass: string;
  backgroundOptions: string[];
}
