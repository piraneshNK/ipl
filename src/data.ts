import { Team, Player } from './types';

export const teams: Team[] = [
  {
    id: 'rpl-csk',
    name: 'Chennai Kings',
    shortName: 'CK',
    primaryColor: 'rgb(255, 185, 0)',
    secondaryColor: 'rgb(0, 56, 131)',
    logo: 'https://images.unsplash.com/photo-1631194758628-71ec7c35137e?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'rpl-mi',
    name: 'Mumbai Warriors',
    shortName: 'MW',
    primaryColor: 'rgb(0, 75, 141)',
    secondaryColor: 'rgb(255, 205, 0)',
    logo: 'https://images.unsplash.com/photo-1631194758628-71ec7c35137e?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'rpl-rcb',
    name: 'Bangalore Titans',
    shortName: 'BT',
    primaryColor: 'rgb(238, 0, 0)',
    secondaryColor: 'rgb(0, 0, 0)',
    logo: 'https://images.unsplash.com/photo-1631194758628-71ec7c35137e?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'rpl-kkr',
    name: 'Kolkata Strikers',
    shortName: 'KS',
    primaryColor: 'rgb(62, 13, 77)',
    secondaryColor: 'rgb(204, 167, 45)',
    logo: 'https://images.unsplash.com/photo-1631194758628-71ec7c35137e?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'rpl-dc',
    name: 'Delhi Dragons',
    shortName: 'DD',
    primaryColor: 'rgb(0, 72, 152)',
    secondaryColor: 'rgb(239, 64, 35)',
    logo: 'https://images.unsplash.com/photo-1631194758628-71ec7c35137e?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'rpl-pk',
    name: 'Punjab Knights',
    shortName: 'PK',
    primaryColor: 'rgb(217, 38, 38)',
    secondaryColor: 'rgb(242, 193, 67)',
    logo: 'https://images.unsplash.com/photo-1631194758628-71ec7c35137e?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'rpl-rr',
    name: 'Rajasthan Royals',
    shortName: 'RR',
    primaryColor: 'rgb(37, 129, 189)',
    secondaryColor: 'rgb(254, 182, 193)',
    logo: 'https://images.unsplash.com/photo-1631194758628-71ec7c35137e?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'rpl-sh',
    name: 'Hyderabad Sunrisers',
    shortName: 'HS',
    primaryColor: 'rgb(255, 130, 42)',
    secondaryColor: 'rgb(0, 0, 0)',
    logo: 'https://images.unsplash.com/photo-1631194758628-71ec7c35137e?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'rpl-gt',
    name: 'Gujarat Giants',
    shortName: 'GG',
    primaryColor: 'rgb(25, 45, 95)',
    secondaryColor: 'rgb(187, 189, 190)',
    logo: 'https://images.unsplash.com/photo-1631194758628-71ec7c35137e?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'rpl-ls',
    name: 'Lucknow Legends',
    shortName: 'LL',
    primaryColor: 'rgb(0, 150, 136)',
    secondaryColor: 'rgb(238, 130, 238)',
    logo: 'https://images.unsplash.com/photo-1631194758628-71ec7c35137e?auto=format&fit=crop&q=80&w=100'
  }
];

export const samplePlayers: Player[] = [
  {
    id: 'p1',
    name: 'Virat Kohli',
    role: 'Batsman',
    basePrice: 20000000,
    image: 'https://images.unsplash.com/photo-1624526267942-ab0c0e9ab345?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'p2',
    name: 'MS Dhoni',
    role: 'Wicket Keeper',
    basePrice: 15000000,
    image: 'https://images.unsplash.com/photo-1624526267942-ab0c0e9ab345?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'p3',
    name: 'Rohit Sharma',
    role: 'Batsman',
    basePrice: 18000000,
    image: 'https://images.unsplash.com/photo-1624526267942-ab0c0e9ab345?auto=format&fit=crop&q=80&w=200'
  }
];

// Export the first player as the sample player
export const samplePlayer = samplePlayers[0];

export const formatPrice = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  return `₹${(amount / 100000).toFixed(1)} L`;
};