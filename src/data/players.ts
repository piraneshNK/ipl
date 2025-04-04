
export interface Player {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper';
  country: string;
  basePrice: number; // in lakhs
  stats?: {
    matches?: number;
    runs?: number;
    wickets?: number;
    average?: number;
    strikeRate?: number;
    economy?: number;
  };
}

export const players: Player[] = [
  {
    id: "p1",
    name: "Virat Kohli",
    role: "Batsman",
    country: "India",
    basePrice: 200,
    stats: {
      matches: 237,
      runs: 7263,
      average: 37.24,
      strikeRate: 130.02,
    },
  },
  {
    id: "p2",
    name: "Jasprit Bumrah",
    role: "Bowler",
    country: "India",
    basePrice: 200,
    stats: {
      matches: 120,
      wickets: 145,
      economy: 7.39,
    },
  },
  {
    id: "p3",
    name: "Hardik Pandya",
    role: "All-Rounder",
    country: "India",
    basePrice: 150,
    stats: {
      matches: 123,
      runs: 2309,
      wickets: 53,
      strikeRate: 139.89,
      economy: 8.73,
    },
  },
  {
    id: "p4",
    name: "MS Dhoni",
    role: "Wicket-Keeper",
    country: "India",
    basePrice: 175,
    stats: {
      matches: 250,
      runs: 5082,
      strikeRate: 135.92,
    },
  },
  {
    id: "p5",
    name: "Jos Buttler",
    role: "Wicket-Keeper",
    country: "England",
    basePrice: 150,
    stats: {
      matches: 96,
      runs: 3223,
      strikeRate: 145.36,
    },
  },
  {
    id: "p6",
    name: "Ravindra Jadeja",
    role: "All-Rounder",
    country: "India",
    basePrice: 150,
    stats: {
      matches: 226,
      runs: 2756,
      wickets: 152,
      economy: 7.58,
    },
  },
  {
    id: "p7",
    name: "Rashid Khan",
    role: "Bowler",
    country: "Afghanistan",
    basePrice: 150,
    stats: {
      matches: 109,
      wickets: 139,
      economy: 6.66,
    },
  },
  {
    id: "p8",
    name: "KL Rahul",
    role: "Batsman",
    country: "India",
    basePrice: 175,
    stats: {
      matches: 115,
      runs: 4162,
      average: 46.24,
      strikeRate: 134.35,
    },
  },
  {
    id: "p9",
    name: "Kagiso Rabada",
    role: "Bowler",
    country: "South Africa",
    basePrice: 150,
    stats: {
      matches: 77,
      wickets: 109,
      economy: 8.25,
    },
  },
  {
    id: "p10",
    name: "Suryakumar Yadav",
    role: "Batsman",
    country: "India",
    basePrice: 125,
    stats: {
      matches: 139,
      runs: 3249,
      average: 31.54,
      strikeRate: 143.32,
    },
  },
];
