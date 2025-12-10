
export type AssetCategory = 'AH_Stock' | 'US_Stock' | 'Commodity' | 'Bond' | 'Wealth' | 'Cash';

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
  aiSummary?: string;
}

export interface HistoryRecord {
  month: string;
  totalAssets: number;
  totalGain: number;
}

export const CATEGORY_LABELS: Record<AssetCategory, string> = {
  'AH_Stock': 'A/H股基金',
  'US_Stock': '美股基金',
  'Commodity': '商品',
  'Bond': '债券基金',
  'Wealth': '理财',
  'Cash': '活钱',
};

// Base colors for fallbacks, but we will use gradients in the UI
export const CATEGORY_COLORS: Record<AssetCategory, string> = {
  'AH_Stock': '#c084fc', 
  'US_Stock': '#f472b6', 
  'Commodity': '#fbbf24', 
  'Bond': '#60a5fa', 
  'Wealth': '#a78bfa', 
  'Cash': '#9ca3af', 
};
