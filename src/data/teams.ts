
export interface Team {
  id: string;
  name: string;
  shortName: string;
  colorClass: string;
  textColorClass: string;
  budget: number;
}

export const teams: Team[] = [
  {
    id: "csk",
    name: "Chennai",
    shortName: "CHE",
    colorClass: "bg-[hsl(var(--csk))]",
    textColorClass: "text-black",
    budget: 10000, // 100 Cr in lakhs
  },
  {
    id: "mi",
    name: "Mumbai",
    shortName: "MUM",
    colorClass: "bg-[hsl(var(--mi))]",
    textColorClass: "text-white",
    budget: 10000,
  },
  {
    id: "rcb",
    name: "Bangalore",
    shortName: "BLR",
    colorClass: "bg-[hsl(var(--rcb))]",
    textColorClass: "text-white",
    budget: 10000,
  },
  {
    id: "kkr",
    name: "Kolkata",
    shortName: "KOL",
    colorClass: "bg-[hsl(var(--kkr))]",
    textColorClass: "text-white",
    budget: 10000,
  },
  {
    id: "dc",
    name: "Delhi",
    shortName: "DEL",
    colorClass: "bg-[hsl(var(--dc))]",
    textColorClass: "text-white",
    budget: 10000,
  },
  {
    id: "srh",
    name: "Hyderabad",
    shortName: "HYD",
    colorClass: "bg-[hsl(var(--srh))]",
    textColorClass: "text-black",
    budget: 10000,
  },
  {
    id: "rr",
    name: "Rajasthan",
    shortName: "RAJ",
    colorClass: "bg-[hsl(var(--rr))]",
    textColorClass: "text-white",
    budget: 10000,
  },
  {
    id: "pbks",
    name: "Punjab",
    shortName: "PUN",
    colorClass: "bg-[hsl(var(--pbks))]",
    textColorClass: "text-white",
    budget: 10000,
  },
  {
    id: "gt",
    name: "Gujarat",
    shortName: "GUJ",
    colorClass: "bg-[hsl(var(--gt))]",
    textColorClass: "text-white",
    budget: 10000,
  },
  {
    id: "lsg",
    name: "Lucknow",
    shortName: "LKN",
    colorClass: "bg-[hsl(var(--lsg))]",
    textColorClass: "text-white",
    budget: 10000,
  },
];
