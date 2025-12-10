
export type AssetCategory = 'AH_Fund' | 'Stock' | 'US_Fund' | 'Commodity' | 'Bond' | 'Wealth' | 'Cash';

export interface AssetPosition {
  id: string;
  name: string;
  category: AssetCategory;
  amount: number;         // Current Market Value
  monthlyGain: number;    // Gain this month
  totalGain: number;      // Total cumulative gain
}

export interface PortfolioData {
  date: string; // YYYY-MM
  positions: AssetPosition[];
}

export interface HistoryRecord {
  month: string;
  totalAssets: number;
  totalGain: number;
}

export const CATEGORY_LABELS: Record<AssetCategory, string> = {
  'AH_Fund': 'A/H股基金',
  'Stock': '股票',
  'US_Fund': '美股基金',
  'Commodity': '商品',
  'Bond': '债券',
  'Wealth': '理财',
  'Cash': '活钱',
};

// Base colors for fallbacks, but we will use gradients in the UI
export const CATEGORY_COLORS: Record<AssetCategory, string> = {
  'AH_Fund': '#c084fc', 
  'Stock': '#f87171',
  'US_Fund': '#f472b6', 
  'Commodity': '#fbbf24', 
  'Bond': '#60a5fa', 
  'Wealth': '#a78bfa', 
  'Cash': '#9ca3af', 
};
