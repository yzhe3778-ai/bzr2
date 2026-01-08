
import { ThemeConfig } from './types';

export const THEMES: ThemeConfig[] = [
  {
    id: 'classic',
    name: '经典小红花',
    icon: '🌸',
    bgColor: 'bg-rose-50',
    accentColor: 'text-rose-600',
    textColor: 'text-slate-700',
    borderColor: 'border-rose-200',
    cardBg: 'bg-white',
    fontClass: 'font-handwriting',
    backgroundOptions: [
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'zootopia',
    name: '疯狂动物城',
    icon: '🦊',
    bgColor: 'bg-emerald-50',
    accentColor: 'text-emerald-700',
    textColor: 'text-slate-800',
    borderColor: 'border-emerald-300',
    cardBg: 'bg-white/90',
    fontClass: 'font-sans',
    backgroundOptions: [
      'https://images.unsplash.com/photo-1518391846015-55a9cc00bb76?auto=format&fit=crop&q=80&w=800', // Cityscape
      'https://images.unsplash.com/photo-1541018939203-36eeab6d9f21?auto=format&fit=crop&q=80&w=800', // Lush Green
      'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=800'  // Modern Tech
    ]
  },
  {
    id: 'spongebob',
    name: '海绵宝宝',
    icon: '🧽',
    bgColor: 'bg-yellow-50',
    accentColor: 'text-amber-600',
    textColor: 'text-blue-900',
    borderColor: 'border-yellow-400',
    cardBg: 'bg-yellow-100',
    fontClass: 'font-sans font-bold',
    backgroundOptions: [
      'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=800', // Ocean Blue
      'https://images.unsplash.com/photo-1544551763-47a0121c1914?auto=format&fit=crop&q=80&w=800', // Sandy Bottom
      'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&q=80&w=800'  // Coral Pink
    ]
  },
  {
    id: 'demon-slayer',
    name: '鬼灭之刃',
    icon: '⚔️',
    bgColor: 'bg-slate-900',
    accentColor: 'text-purple-400',
    textColor: 'text-slate-100',
    borderColor: 'border-purple-900',
    cardBg: 'bg-slate-800',
    fontClass: 'font-artistic',
    backgroundOptions: [
      'https://images.unsplash.com/photo-1528164344705-4754268799af?auto=format&fit=crop&q=80&w=800', // Traditional Japanese
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800', // Night Temple
      'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&q=80&w=800'  // Purple Fog/Mist
    ]
  },
  {
    id: 'minions',
    name: '小黄人',
    icon: '🍌',
    bgColor: 'bg-blue-50',
    accentColor: 'text-blue-600',
    textColor: 'text-slate-800',
    borderColor: 'border-yellow-500',
    cardBg: 'bg-yellow-400',
    fontClass: 'font-sans',
    backgroundOptions: [
      'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&q=80&w=800', // Pure Yellow
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800', // Blue Denim Texture
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800'  // Playful Lab
    ]
  },
  {
    id: 'harry-potter',
    name: '哈利波特',
    icon: '🪄',
    bgColor: 'bg-amber-50',
    accentColor: 'text-amber-900',
    textColor: 'text-stone-800',
    borderColor: 'border-amber-800',
    cardBg: 'bg-amber-100',
    fontClass: 'font-serif',
    backgroundOptions: [
      'https://images.unsplash.com/photo-1514894780063-5819e8d97317?auto=format&fit=crop&q=80&w=800', // Old Books/Scrolls
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800', // Magic Forest
      'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=800'  // Stone Castle
    ]
  }
];
