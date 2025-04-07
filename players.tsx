export interface Player {
  id: number
  name: string
  role: string
  basePrice: string
  basePriceValue: number // Numerical value for calculations
  team?: string
  soldFor?: string
  soldForValue?: number // Numerical value for calculations
  status?: "Pending" | "Current" | "Sold" | "Unsold" | "RTM"
}

// Converting base price strings to numerical values for calculations
const convertPriceToNumber = (price: string): number => {
  if (price.includes("Cr")) {
    return Number.parseFloat(price.replace("Cr", "")) * 100
  } else if (price.includes("L")) {
    return Number.parseFloat(price.replace("L", ""))
  }
  return Number.parseFloat(price)
}

// Parse base price to get numerical value
const parseBasePrice = (basePrice: string): number => {
  if (basePrice.includes("Cr")) {
    return Number.parseFloat(basePrice.replace(" Cr", "")) * 100
  } else if (basePrice.includes("L")) {
    return Number.parseFloat(basePrice.replace(" L", ""))
  }
  return 0
}

// Real IPL player list
export const players: Player[] = [
  { id: 1, name: "Ruturaj Gaikwad", role: "Right-handed Batter", basePrice: "2 Cr", basePriceValue: 200 },
  {
    id: 2,
    name: "Ravindra Jadeja",
    role: "Left-arm Orthodox Spinner, Left-handed Batter",
    basePrice: "2 Cr",
    basePriceValue: 200,
  },
  { id: 3, name: "Matheesha Pathirana", role: "Right-arm Fast Bowler", basePrice: "2 Cr", basePriceValue: 200 },
  {
    id: 4,
    name: "Shivam Dube",
    role: "Left-arm Medium Bowler, Left-handed Batter",
    basePrice: "2 Cr",
    basePriceValue: 200,
  },
  { id: 5, name: "MS Dhoni", role: "Right-handed Batter, Wicket-keeper", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 6, name: "Devon Conway", role: "Left-handed Batter", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 7, name: "Rahul Tripathi", role: "Right-handed Batter", basePrice: "75 L", basePriceValue: 75 },
  {
    id: 8,
    name: "Rachin Ravindra",
    role: "Left-arm Medium Bowler, Left-handed Batter",
    basePrice: "1.5 Cr",
    basePriceValue: 150,
  },
  {
    id: 9,
    name: "Ravichandran Ashwin",
    role: "Right-arm Off-spinner, Right-handed Batter",
    basePrice: "2 Cr",
    basePriceValue: 200,
  },
  { id: 10, name: "Syed Khaleel Ahmed", role: "Left-arm Medium Bowler", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 11, name: "Noor Ahmad", role: "Left-arm Wrist-spinner", basePrice: "2 Cr", basePriceValue: 200 },
  {
    id: 12,
    name: "Vijay Shankar",
    role: "Right-arm Medium Bowler, Right-handed Batter",
    basePrice: "30 L",
    basePriceValue: 30,
  },
  {
    id: 13,
    name: "Sam Curran",
    role: "Left-arm Medium-fast Bowler, Left-handed Batter",
    basePrice: "2 Cr",
    basePriceValue: 200,
  },
  { id: 14, name: "Shaik Rasheed", role: "Right-handed Batter", basePrice: "30 L", basePriceValue: 30 },
  {
    id: 15,
    name: "Anshul Kamboj",
    role: "Right-arm Medium Bowler, Right-handed Batter",
    basePrice: "30 L",
    basePriceValue: 30,
  },
  { id: 16, name: "Mukesh Choudhary", role: "Left-arm Medium Bowler", basePrice: "30 L", basePriceValue: 30 },
  {
    id: 17,
    name: "Deepak Hooda",
    role: "Right-arm Off-spinner, Right-handed Batter",
    basePrice: "75 L",
    basePriceValue: 75,
  },
  { id: 18, name: "Gurjapneet Singh", role: "Right-arm Medium Bowler", basePrice: "30 L", basePriceValue: 30 },
  { id: 19, name: "Nathan Ellis", role: "Right-arm Fast Bowler", basePrice: "1.25 Cr", basePriceValue: 125 },
  {
    id: 20,
    name: "Jamie Overton",
    role: "Right-arm Fast-medium Bowler, Right-handed Batter",
    basePrice: "1.5 Cr",
    basePriceValue: 150,
  },
  { id: 21, name: "Kamlesh Nagarkoti", role: "Right-arm Fast Bowler", basePrice: "30 L", basePriceValue: 30 },
  {
    id: 22,
    name: "Ramakrishna Ghosh",
    role: "Right-arm Medium Bowler, Right-handed Batter",
    basePrice: "30 L",
    basePriceValue: 30,
  },
  {
    id: 23,
    name: "Shreyas Gopal",
    role: "Leg-break Googly Bowler, Right-handed Batter",
    basePrice: "30 L",
    basePriceValue: 30,
  },
  { id: 24, name: "Vansh Bedi", role: "Left-handed Batter", basePrice: "30 L", basePriceValue: 30 },
  { id: 25, name: "C Andre Siddarth", role: "Right-handed Batter", basePrice: "30 L", basePriceValue: 30 },
  { id: 26, name: "Rohit Sharma", role: "Right-handed Batter", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 27, name: "Suryakumar Yadav", role: "Right-handed Batter", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 28, name: "Jasprit Bumrah", role: "Right-arm Fast Bowler", basePrice: "2 Cr", basePriceValue: 200 },
  {
    id: 29,
    name: "Hardik Pandya",
    role: "Right-arm Medium-fast Bowler, Right-handed Batter",
    basePrice: "2 Cr",
    basePriceValue: 200,
  },
  { id: 30, name: "Tilak Varma", role: "Left-handed Batter", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 31, name: "Trent Boult", role: "Left-arm Fast-medium Bowler", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 32, name: "Deepak Chahar", role: "Right-arm Medium Bowler", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 33, name: "Will Jacks", role: "Right-handed Batter, Off-break Bowler", basePrice: "2 Cr", basePriceValue: 200 },
  {
    id: 34,
    name: "Mitchell Santner",
    role: "Left-arm Orthodox Spinner, Left-handed Batter",
    basePrice: "2 Cr",
    basePriceValue: 200,
  },
  { id: 35, name: "Naman Dhir", role: "Right-handed Batter, Off-break Bowler", basePrice: "30 L", basePriceValue: 30 },
  { id: 36, name: "Robin Minz", role: "Wicket-keeper, Right-handed Batter", basePrice: "30 L", basePriceValue: 30 },
  {
    id: 37,
    name: "Karn Sharma",
    role: "Leg-break Googly Bowler, Right-handed Batter",
    basePrice: "50 L",
    basePriceValue: 50,
  },
  {
    id: 38,
    name: "Ryan Rickelton",
    role: "Wicket-keeper, Right-handed Batter",
    basePrice: "1 Cr",
    basePriceValue: 100,
  },
  { id: 39, name: "Allah Ghazanfar", role: "Leg-break Bowler", basePrice: "75 L", basePriceValue: 75 },
  { id: 40, name: "Ashwani Kumar", role: "Right-arm Medium Bowler", basePrice: "30 L", basePriceValue: 30 },
  { id: 41, name: "Reece Topley", role: "Left-arm Fast-medium Bowler", basePrice: "75 L", basePriceValue: 75 },
  {
    id: 42,
    name: "Shrijith Krishnan",
    role: "Wicket-keeper, Right-handed Batter",
    basePrice: "30 L",
    basePriceValue: 30,
  },
  {
    id: 43,
    name: "Raj Angad Bawa",
    role: "Right-arm Medium Bowler, Right-handed Batter",
    basePrice: "30 L",
    basePriceValue: 30,
  },
  { id: 44, name: "Satyanarayana Raju", role: "Right-arm Medium Bowler", basePrice: "30 L", basePriceValue: 30 },
  { id: 45, name: "Bevan John Jacobs", role: "Right-handed Batter", basePrice: "30 L", basePriceValue: 30 },
  {
    id: 46,
    name: "Arjun Tendulkar",
    role: "Left-arm Medium Bowler, Left-handed Batter",
    basePrice: "30 L",
    basePriceValue: 30,
  },
  { id: 47, name: "Lizaad Williams", role: "Right-arm Fast Bowler", basePrice: "75 L", basePriceValue: 75 },
  {
    id: 48,
    name: "Vignesh Puthur",
    role: "Right-arm Medium Bowler, Right-handed Batter",
    basePrice: "30 L",
    basePriceValue: 30,
  },
  { id: 49, name: "Ajinkya Rahane", role: "Batter", basePrice: "1.5 Cr", basePriceValue: 150 },
  { id: 50, name: "Rinku Singh", role: "Batter", basePrice: "13 Cr", basePriceValue: 1300 },
  { id: 51, name: "Quinton de Kock", role: "WK-Batter", basePrice: "3.6 Cr", basePriceValue: 360 },
  { id: 52, name: "Rahmanullah Gurbaz", role: "WK-Batter", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 53, name: "Angkrish Raghuvanshi", role: "Batter", basePrice: "3 Cr", basePriceValue: 300 },
  { id: 54, name: "Rovman Powell", role: "Batter", basePrice: "1.5 Cr", basePriceValue: 150 },
  { id: 55, name: "Manish Pandey", role: "Batter", basePrice: "75 L", basePriceValue: 75 },
  { id: 56, name: "Luvnith Sisodia", role: "WK-Batter", basePrice: "30 L", basePriceValue: 30 },
  { id: 57, name: "Venkatesh Iyer", role: "All-Rounder", basePrice: "23.75 Cr", basePriceValue: 2375 },
  { id: 58, name: "Anukul Roy", role: "All-Rounder", basePrice: "40 L", basePriceValue: 40 },
  { id: 59, name: "Moeen Ali", role: "All-Rounder", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 60, name: "Ramandeep Singh", role: "All-Rounder", basePrice: "4 Cr", basePriceValue: 400 },
  { id: 61, name: "Andre Russell", role: "All-Rounder", basePrice: "12 Cr", basePriceValue: 1200 },
  { id: 62, name: "Anrich Nortje", role: "Bowler", basePrice: "6.5 Cr", basePriceValue: 650 },
  { id: 63, name: "Vaibhav Arora", role: "Bowler", basePrice: "1.8 Cr", basePriceValue: 180 },
  { id: 64, name: "Mayank Markande", role: "Bowler", basePrice: "30 L", basePriceValue: 30 },
  { id: 65, name: "Spencer Johnson", role: "Bowler", basePrice: "2.8 Cr", basePriceValue: 280 },
  { id: 66, name: "Harshit Rana", role: "Bowler", basePrice: "4 Cr", basePriceValue: 400 },
  { id: 67, name: "Sunil Narine", role: "Bowler", basePrice: "12 Cr", basePriceValue: 1200 },
  { id: 68, name: "Varun Chakaravarthy", role: "Bowler", basePrice: "12 Cr", basePriceValue: 1200 },
  { id: 69, name: "Chetan Sakariya", role: "Bowler", basePrice: "75 L", basePriceValue: 75 },
  { id: 70, name: "Umran Malik", role: "Bowler", basePrice: "75 L", basePriceValue: 75 },
  { id: 71, name: "Virat Kohli", role: "Right-handed Batter", basePrice: "21 Cr", basePriceValue: 2100 },
  {
    id: 72,
    name: "Glenn Maxwell",
    role: "Right-handed Batter, Off-break Bowler",
    basePrice: "11 Cr",
    basePriceValue: 1100,
  },
  { id: 73, name: "Faf du Plessis", role: "Right-handed Batter", basePrice: "7 Cr", basePriceValue: 700 },
  { id: 74, name: "Mohammed Siraj", role: "Right-arm Fast-medium Bowler", basePrice: "7 Cr", basePriceValue: 700 },
  { id: 75, name: "Cameron Green", role: "All-Rounder", basePrice: "17.5 Cr", basePriceValue: 1750 },
  { id: 76, name: "Yash Dayal", role: "Left-arm Fast-medium Bowler", basePrice: "5 Cr", basePriceValue: 500 },
  { id: 77, name: "Alzarri Joseph", role: "Right-arm Fast Bowler", basePrice: "11.5 Cr", basePriceValue: 1150 },
  { id: 78, name: "Lockie Ferguson", role: "Right-arm Fast Bowler", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 79, name: "Mayank Dagar", role: "Left-arm Orthodox Spinner", basePrice: "1.8 Cr", basePriceValue: 180 },
  {
    id: 80,
    name: "Tom Curran",
    role: "Right-arm Fast-medium Bowler, Right-handed Batter",
    basePrice: "1.5 Cr",
    basePriceValue: 150,
  },
  { id: 81, name: "Suyash Prabhudessai", role: "Right-handed Batter", basePrice: "30 L", basePriceValue: 30 },
  { id: 82, name: "Rajat Patidar", role: "Right-handed Batter", basePrice: "20 L", basePriceValue: 20 },
  { id: 83, name: "Vyshak Vijay Kumar", role: "Right-arm Medium Bowler", basePrice: "20 L", basePriceValue: 20 },
  { id: 84, name: "Akash Deep", role: "Right-arm Medium Bowler", basePrice: "20 L", basePriceValue: 20 },
  {
    id: 85,
    name: "Mahipal Lomror",
    role: "Left-handed Batter, Slow Left-arm Orthodox",
    basePrice: "20 L",
    basePriceValue: 20,
  },
  { id: 86, name: "Himanshu Sharma", role: "Right-arm Leg-break Bowler", basePrice: "20 L", basePriceValue: 20 },
  { id: 87, name: "Reece Topley", role: "Left-arm Fast-medium Bowler", basePrice: "75 L", basePriceValue: 75 },
  {
    id: 88,
    name: "Swapnil Singh",
    role: "Left-arm Orthodox Spinner, Right-handed Batter",
    basePrice: "20 L",
    basePriceValue: 20,
  },
  { id: 89, name: "Saurav Chauhan", role: "Right-handed Batter", basePrice: "20 L", basePriceValue: 20 },
  { id: 90, name: "Anuj Rawat", role: "Wicket-keeper, Left-handed Batter", basePrice: "3.8 Cr", basePriceValue: 380 },
  {
    id: 91,
    name: "Dinesh Karthik",
    role: "Wicket-keeper, Right-handed Batter",
    basePrice: "5.5 Cr",
    basePriceValue: 550,
  },
  { id: 92, name: "David Warner", role: "Left-handed Batter", basePrice: "6.25 Cr", basePriceValue: 625 },
  { id: 93, name: "Rishabh Pant", role: "Wicket-keeper, Left-handed Batter", basePrice: "16 Cr", basePriceValue: 1600 },
  { id: 94, name: "Prithvi Shaw", role: "Right-handed Batter", basePrice: "7.5 Cr", basePriceValue: 750 },
  {
    id: 95,
    name: "Axar Patel",
    role: "Left-arm Orthodox Spinner, Left-handed Batter",
    basePrice: "9 Cr",
    basePriceValue: 900,
  },
  { id: 96, name: "Anrich Nortje", role: "Right-arm Fast Bowler", basePrice: "6.5 Cr", basePriceValue: 650 },
  { id: 97, name: "Kuldeep Yadav", role: "Left-arm Wrist-spinner", basePrice: "3 Cr", basePriceValue: 300 },
  {
    id: 98,
    name: "Mitchell Marsh",
    role: "Right-arm Medium Bowler, Right-handed Batter",
    basePrice: "6.5 Cr",
    basePriceValue: 650,
  },
  { id: 99, name: "Lungi Ngidi", role: "Right-arm Fast Bowler", basePrice: "50 L", basePriceValue: 50 },
  { id: 100, name: "Khaleel Ahmed", role: "Left-arm Medium Bowler", basePrice: "5.25 Cr", basePriceValue: 525 },
  // Adding more players from the list
  {
    id: 101,
    name: "Heinrich Klaasen",
    role: "Wicket-keeper, Right-handed Batter",
    basePrice: "23 Cr",
    basePriceValue: 2300,
  },
  {
    id: 102,
    name: "Pat Cummins",
    role: "Right-arm Fast Bowler, Right-handed Batter",
    basePrice: "18 Cr",
    basePriceValue: 1800,
  },
  {
    id: 103,
    name: "Abhishek Sharma",
    role: "Left-handed Batter, Left-arm Orthodox Spinner",
    basePrice: "14 Cr",
    basePriceValue: 1400,
  },
  {
    id: 104,
    name: "Travis Head",
    role: "Left-handed Batter, Right-arm Off-break Bowler",
    basePrice: "14 Cr",
    basePriceValue: 1400,
  },
  { id: 105, name: "Sanju Samson", role: "Wicket-keeper, Right-handed Batter", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 106, name: "Yashasvi Jaiswal", role: "Left-handed Batter", basePrice: "2 Cr", basePriceValue: 200 },
  {
    id: 107,
    name: "Riyan Parag",
    role: "Right-handed Batter, Right-arm Leg-break",
    basePrice: "2 Cr",
    basePriceValue: 200,
  },
  { id: 108, name: "Dhruv Jurel", role: "Wicket-keeper, Right-handed Batter", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 109, name: "Shimron Hetmyer", role: "Left-handed Batter", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 110, name: "Shubman Gill", role: "Batter", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 111, name: "Jos Buttler", role: "Wicket-keeper, Batter", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 112, name: "Sai Sudharsan", role: "Batter", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 113, name: "Shahrukh Khan", role: "Batter", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 114, name: "Glenn Phillips", role: "Batter, Off-break Bowler", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 115, name: "Shreyas Iyer", role: "Batter", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 116, name: "Prabhsimran Singh", role: "Wicket-keeper, Batter", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 117, name: "Shashank Singh", role: "Batter, All-rounder", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 118, name: "Marcus Stoinis", role: "All-rounder", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 119, name: "Arshdeep Singh", role: "Bowler, Left-arm Medium-fast", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 120, name: "Yuzvendra Chahal", role: "Bowler, Leg-break Googly", basePrice: "2 Cr", basePriceValue: 200 },
  // Adding some legendary players
  {
    id: 121,
    name: "Suresh Raina",
    role: "Left-handed Batter, Part-time Off-spinner",
    basePrice: "2 Cr",
    basePriceValue: 200,
  },
  {
    id: 122,
    name: "AB de Villiers",
    role: "Right-handed Batter, Wicket-keeper",
    basePrice: "2 Cr",
    basePriceValue: 200,
  },
  {
    id: 123,
    name: "Shane Watson",
    role: "Right-handed Batter, Right-arm Fast-medium Bowler",
    basePrice: "2 Cr",
    basePriceValue: 200,
  },
  {
    id: 124,
    name: "Yuvraj Singh",
    role: "Left-handed Batter, Left-arm Orthodox Spinner",
    basePrice: "2 Cr",
    basePriceValue: 200,
  },
  { id: 125, name: "Chris Gayle", role: "Left-handed Batter", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 126, name: "Harbhajan Singh", role: "Right-arm Off-spinner", basePrice: "2 Cr", basePriceValue: 200 },
  { id: 127, name: "Michael Hussey", role: "Left-handed Batter", basePrice: "2 Cr", basePriceValue: 200 },
  {
    id: 128,
    name: "Adam Gilchrist",
    role: "Left-handed Batter, Wicket-keeper",
    basePrice: "2 Cr",
    basePriceValue: 200,
  },
  { id: 129, name: "Murali Vijay", role: "Right-handed Batter", basePrice: "2 Cr", basePriceValue: 200 },
  {
    id: 130,
    name: "Kieron Pollard",
    role: "Right-handed Batter, Right-arm Medium-fast Bowler",
    basePrice: "2 Cr",
    basePriceValue: 200,
  },
]

// Shuffle the players array
export const shuffledPlayers: Player[] = [...players].sort(() => Math.random() - 0.5)

// Team data with purse information - Using IPL team names
export interface Team {
  id: number
  name: string
  shortName: string
  color: string
  purse: number // in lakhs (100 Cr = 10000 lakhs)
  spent: number // in lakhs
  players: Player[]
}

export const teams: Team[] = [
  { id: 1, name: "Mumbai Indians", shortName: "MI", color: "blue", purse: 10000, spent: 0, players: [] },
  { id: 2, name: "Chennai Super Kings", shortName: "CSK", color: "yellow", purse: 10000, spent: 0, players: [] },
  { id: 3, name: "Kolkata Knight Riders", shortName: "KKR", color: "purple", purse: 10000, spent: 0, players: [] },
  { id: 4, name: "Royal Challengers Bangalore", shortName: "RCB", color: "red", purse: 10000, spent: 0, players: [] },
  { id: 5, name: "Delhi Capitals", shortName: "DC", color: "blue", purse: 10000, spent: 0, players: [] },
  { id: 6, name: "Sunrisers Hyderabad", shortName: "SRH", color: "orange", purse: 10000, spent: 0, players: [] },
  { id: 7, name: "Gujarat Titans", shortName: "GT", color: "teal", purse: 10000, spent: 0, players: [] },
  { id: 8, name: "Lucknow Super Giants", shortName: "LSG", color: "green", purse: 10000, spent: 0, players: [] },
  { id: 9, name: "Rajasthan Royals", shortName: "RR", color: "pink", purse: 10000, spent: 0, players: [] },
  { id: 10, name: "Punjab Kings", shortName: "PBKS", color: "red", purse: 10000, spent: 0, players: [] },
]

// Helper function to format price for display
export const formatPrice = (price: number): string => {
  if (price >= 100) {
    return `${(price / 100).toFixed(2)}Cr`
  } else {
    return `${price}L`
  }
}

