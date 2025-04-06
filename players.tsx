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

// Original player list from the file (shuffled)
const originalPlayers = [
  { id: 1, name: "MOHIT RATHEE", role: "Bowler", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 2, name: "VIGNESH PUTHUR", role: "Bowler", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 3, name: "ASHOK SHARMA", role: "Bowler", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 4, name: "RAJ LIMBANI", role: "All-rounder", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 5, name: "ABHINANDAN SINGH", role: "Bowler", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 6, name: "LUNGI NGIDI", role: "Bowler", basePrice: "1.00Cr", basePriceValue: 100 },
  { id: 7, name: "OTTNEIL BAARTMAN", role: "Bowler", basePrice: "0.75Cr", basePriceValue: 75 },
  { id: 8, name: "KULWANT KHEJROLIYA", role: "Bowler", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 9, name: "SHIVAM MAVI", role: "All-rounder", basePrice: "0.75Cr", basePriceValue: 75 },
  { id: 10, name: "LIZAAD WILLIAMS", role: "Bowler", basePrice: "0.75Cr", basePriceValue: 75 },
  { id: 11, name: "ARJUN TENDULKAR", role: "All-rounder", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 12, name: "KUNAL SINGH RATHORE", role: "Batter", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 13, name: "KHRIEVITSO KENSE", role: "Bowler", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 14, name: "MADHAV TIWARI", role: "Batter", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 15, name: "TRIPURANA VIJAY", role: "All-rounder", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 16, name: "ATIT SHETH", role: "All-rounder", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 17, name: "BEVON JACOBS", role: "Batter", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 18, name: "KARIM JANAT", role: "All-rounder", basePrice: "0.75Cr", basePriceValue: 75 },
  { id: 19, name: "TEJASVI DAHIYA", role: "Batter", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 20, name: "SANDEEP WARRIER", role: "Bowler", basePrice: "0.75Cr", basePriceValue: 75 },
  { id: 21, name: "MANVANTH KUMAR L", role: "Bowler", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 22, name: "MATTHEW SHORT", role: "All-rounder", basePrice: "0.75Cr", basePriceValue: 75 },
  { id: 23, name: "SHIVALIK SHARMA", role: "All-rounder", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 24, name: "AJAY MANDAL", role: "All-rounder", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 25, name: "PRAVIN DUBEY", role: "Bowler", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 26, name: "LEUS DU PLOOY", role: "Batter", basePrice: "0.50Cr", basePriceValue: 50 },
  { id: 27, name: "KWENA MAPHAKA", role: "Bowler", basePrice: "0.75Cr", basePriceValue: 75 },
  { id: 28, name: "TOM LATHAM", role: "Wicket-keeper", basePrice: "1.50Cr", basePriceValue: 150 },
  { id: 29, name: "SIKANDAR RAZA", role: "All-rounder", basePrice: "1.25Cr", basePriceValue: 125 },
  { id: 30, name: "GUS ATKINSON", role: "All-rounder", basePrice: "2.00Cr", basePriceValue: 200 },
  { id: 31, name: "BRANDON KING", role: "Batter", basePrice: "0.75Cr", basePriceValue: 75 },
  { id: 32, name: "MATTHEW BREETZKE", role: "Batter", basePrice: "0.75Cr", basePriceValue: 75 },
  { id: 33, name: "MURUGAN ASHWIN", role: "Bowler", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 34, name: "LR CHETHAN", role: "Batter", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 35, name: "ARSHIN KULKARNI", role: "All-rounder", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 36, name: "TANUSH KOTIAN", role: "All-rounder", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 37, name: "RAJVARDHAN HANGARGEKAR", role: "All-rounder", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 38, name: "ANDRE SIDDHARTH", role: "All-rounder", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 39, name: "SACHIN BABY", role: "Batter", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 40, name: "UMRAN MALIK", role: "Bowler", basePrice: "0.75Cr", basePriceValue: 75 },
  { id: 41, name: "MOEEN ALI", role: "All-rounder", basePrice: "2.00Cr", basePriceValue: 200 },
  { id: 42, name: "DEWALD BREVIS", role: "Batter", basePrice: "0.75Cr", basePriceValue: 75 },
  { id: 43, name: "PRASHANT SOLANKI", role: "Bowler", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 44, name: "PRINCE CHOUDHARY", role: "Bowler", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 45, name: "HARVIK DESAI", role: "Wicket-keeper", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 46, name: "VANSH BEDI", role: "Bowler", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 47, name: "ANUKUL ROY", role: "All-rounder", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 48, name: "PUKHRAJ MANN", role: "All-rounder", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 49, name: "SWASTIK CHIKARA", role: "Batter", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 50, name: "DONOVAN FERREIRA", role: "Wicket-keeper", basePrice: "0.75Cr", basePriceValue: 75 },
  { id: 51, name: "SHARDUL THAKUR", role: "All-rounder", basePrice: "2.00Cr", basePriceValue: 200 },
  { id: 52, name: "AJINKYA RAHANE", role: "Batter", basePrice: "1.50Cr", basePriceValue: 150 },
  { id: 53, name: "GLENN PHILLIPS", role: "Wicket-keeper", basePrice: "2.00Cr", basePriceValue: 200 },
  { id: 54, name: "MAYANK AGARWAL", role: "Batter", basePrice: "1.00Cr", basePriceValue: 100 },
  { id: 55, name: "SHREYAS GOPAL", role: "All-rounder", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 56, name: "PIYUSH CHAWLA", role: "Bowler", basePrice: "0.50Cr", basePriceValue: 50 },
  { id: 57, name: "LUVNITH SISODIA", role: "Wicket-keeper", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 58, name: "ANMOLPREET SINGH", role: "Batter", basePrice: "0.30Cr", basePriceValue: 30 },
  { id: 59, name: "DAVID WARNER", role: "Batter", basePrice: "2.00Cr", basePriceValue: 200 },
  { id: 60, name: "DEVDUTT PADIKKAL", role: "Batter", basePrice: "2.00Cr", basePriceValue: 200 },
  { id: 61, name: "VIRAT KOHLI", role: "Batter", basePrice: "2.00Cr", basePriceValue: 200 },
  { id: 62, name: "ROHIT SHARMA", role: "Batter", basePrice: "2.00Cr", basePriceValue: 200 },
  { id: 63, name: "JASPRIT BUMRAH", role: "Bowler", basePrice: "2.00Cr", basePriceValue: 200 },
  { id: 64, name: "RAVINDRA JADEJA", role: "All-rounder", basePrice: "1.50Cr", basePriceValue: 150 },
  { id: 65, name: "MS DHONI", role: "Wicket-keeper", basePrice: "2.00Cr", basePriceValue: 200 },
  { id: 66, name: "HARDIK PANDYA", role: "All-rounder", basePrice: "1.50Cr", basePriceValue: 150 },
  { id: 67, name: "KL RAHUL", role: "Wicket-keeper", basePrice: "2.00Cr", basePriceValue: 200 },
  { id: 68, name: "SURYAKUMAR YADAV", role: "Batter", basePrice: "2.00Cr", basePriceValue: 200 },
  { id: 69, name: "RISHABH PANT", role: "Wicket-keeper", basePrice: "2.00Cr", basePriceValue: 200 },
  { id: 70, name: "YUZVENDRA CHAHAL", role: "Bowler", basePrice: "1.50Cr", basePriceValue: 150 },
]

// Shuffle the players array
export const players: Player[] = [...originalPlayers]
  .sort(() => Math.random() - 0.5)
  .map((player, index) => ({ ...player, id: index + 1 }))

// Team data with purse information - Using IPL team city names
export interface Team {
  id: number
  name: string
  color: string
  purse: number // in lakhs (100 Cr = 10000 lakhs)
  spent: number // in lakhs
  players: Player[]
}

export const teams: Team[] = [
  { id: 1, name: "Mumbai", color: "blue", purse: 10000, spent: 0, players: [] },
  { id: 2, name: "Chennai", color: "yellow", purse: 10000, spent: 0, players: [] },
  { id: 3, name: "Kolkata", color: "purple", purse: 10000, spent: 0, players: [] },
  { id: 4, name: "Bengaluru", color: "red", purse: 10000, spent: 0, players: [] },
  { id: 5, name: "Delhi", color: "blue", purse: 10000, spent: 0, players: [] },
  { id: 6, name: "Hyderabad", color: "orange", purse: 10000, spent: 0, players: [] },
  { id: 7, name: "Ahmedabad", color: "teal", purse: 10000, spent: 0, players: [] },
  { id: 8, name: "Lucknow", color: "green", purse: 10000, spent: 0, players: [] },
  { id: 9, name: "Jaipur", color: "pink", purse: 10000, spent: 0, players: [] },
  { id: 10, name: "Mohali", color: "red", purse: 10000, spent: 0, players: [] },
]

// Helper function to format price for display
export const formatPrice = (price: number): string => {
  if (price >= 100) {
    return `${(price / 100).toFixed(2)}Cr`
  } else {
    return `${price}L`
  }
}

