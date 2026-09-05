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

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "Never";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Never";
  const dateStr = d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${dateStr}, ${timeStr}`;
}

export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return "Never";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Never";
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 45) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return `Yesterday at ${formatTime(date)}`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDateTime(date);
}
