import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Pakistani Rupees (PKR)
 * Format as Lakh / Crore for intuitive reading (e.g., PKR 1.85 Crore, PKR 45 Lakh)
 */
export function formatPKR(amount: number): string {
  if (amount === undefined || amount === null) return "PKR 0";
  
  if (amount >= 10000000) {
    const crore = (amount / 10000000).toFixed(2).replace(/\.00$/, "");
    return `PKR ${crore} Crore`;
  }
  if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(2).replace(/\.00$/, "");
    return `PKR ${lakh} Lakh`;
  }
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

/**
 * Convert land sizes across Marla, Kanal, Sq Ft, Sq Yds
 */
export function convertLandSize(size: number, fromUnit: "MARLA" | "KANAL" | "SQFT" | "SQYDS") {
  // Base unit: Sq Ft (1 Marla = 272.25 Sq Ft, 1 Kanal = 20 Marla = 5445 Sq Ft, 1 Sq Yd = 9 Sq Ft)
  let sqft = 0;
  switch (fromUnit) {
    case "MARLA":
      sqft = size * 272.25;
      break;
    case "KANAL":
      sqft = size * 5445;
      break;
    case "SQFT":
      sqft = size;
      break;
    case "SQYDS":
      sqft = size * 9;
      break;
  }

  return {
    sqft: Math.round(sqft),
    marla: (sqft / 272.25).toFixed(2),
    kanal: (sqft / 5445).toFixed(2),
    sqyds: Math.round(sqft / 9),
  };
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
