
import React, { useMemo } from 'react';
import { AssetPosition, CATEGORY_LABELS, AssetCategory } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ReportViewProps {
  date: string;
  positions: AssetPosition[];
}

interface CategoryStat {
  amount: number;
  monthlyGain: number;
  totalGain: number;
  percentage: number;
  count: number;
}

// Define gradients for each category - Softer, more pastel modern palette
const CATEGORY_GRADIENTS: Record<AssetCategory, { start: string, end: string, id: string }> = {
  'AH_Fund': { start: '#e9d5ff', end: '#a855f7', id: 'grad_ah' },     // Purple
  'Stock': { start: '#fca5a5', end: '#ef4444', id: 'grad_stock' },    // Red/Rose for Stocks
  'US_Fund': { start: '#fbcfe8', end: '#ec4899', id: 'grad_us' },     // Pink
  'Commodity': { start: '#fde68a', end: '#d97706', id: 'grad_comm' }, // Amber
  'Bond': { start: '#bfdbfe', end: '#3b82f6', id: 'grad_bond' },      // Blue
  'Wealth': { start: '#ddd6fe', end: '#7c3aed', id: 'grad_wealth' },  // Violet
  'Cash': { start: '#e5e7eb', end: '#9ca3af', id: 'grad_cash' },      // Gray
};

const ReportView: React.FC<ReportViewProps> = ({ date, positions }) => {
  // --- Calculations ---
  const totalAmount = positions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalMonthlyGain = positions.reduce((acc, curr) => acc + curr.monthlyGain, 0);
  const totalCumulativeGain = positions.reduce((acc, curr) => acc + curr.totalGain, 0);

  // Approximate yield calculations
  const monthlyYield = totalAmount !== 0 ? (totalMonthlyGain / (totalAmount - totalMonthlyGain)) * 100 : 0;
  const totalYield = totalAmount !== 0 ? (totalCumulativeGain / (totalAmount - totalCumulativeGain)) * 100 : 0;

  const categoryStats = useMemo(() => {
    const stats: Record<string, CategoryStat> = {};
    
    // Initialize
    (Object.keys(CATEGORY_LABELS) as AssetCategory[]).forEach(cat => {
      stats[cat] = { amount: 0, monthlyGain: 0, totalGain: 0, percentage: 0, count: 0 };
    });

    // Sum up
    positions.forEach(p => {
      if (stats[p.category]) {
        stats[p.category].amount += p.amount;
        stats[p.category].monthlyGain += p.monthlyGain;
        stats[p.category].totalGain += p.totalGain;
        stats[p.category].count += 1;
      }
    });

    // Calculate percentage
    Object.keys(stats).forEach(key => {
      if (totalAmount > 0) {
        stats[key].percentage = (stats[key].amount / totalAmount) * 100; // Keep precise for bar width, round for display
      }
    });

    return stats;
  }, [positions, totalAmount]);

  const pieData = (Object.entries(categoryStats) as [string, CategoryStat][])
    .filter(([_, data]) => data.amount > 0)
    .map(([key, data]) => ({
      name: CATEGORY_LABELS[key as AssetCategory].split('基金')[0], // Shorten names for chart
      value: data.amount,
      categoryKey: key
    }));

  const groupedPositions = useMemo(() => {
    const grouped: Record<string, AssetPosition[]> = {};
    (Object.keys(CATEGORY_LABELS) as AssetCategory[]).forEach(cat => {
      grouped[cat] = positions.filter(p => p.category === cat);
    });
    return grouped;
  }, [positions]);

  // Format Helpers
  const formatDate = (dateStr: string) => {
    if (!dateStr) return { monthStr: '--', yearStr: '--' };
    const parts = dateStr.split('-');
    if (parts.length < 2) return { monthStr: '--', yearStr: '--' };
    
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    
    return { monthStr: `${month}月`, yearStr: `${year}` };
  };

  const { monthStr, yearStr } = formatDate(date);

  // Format number to Wan (10k)
  const toWan = (num: number) => {
    if (Math.abs(num) < 10000 && Math.abs(num) > 0) return (num / 10000).toFixed(4) + '万';
    return (num / 10000).toFixed(1) + '万';
  };
  
  const formatPct = (val: number) => {
      return (val > 0 ? '+' : '') + val.toFixed(2) + '%';
  };

  // Custom Label for Pie Chart - Optimized to avoid clipping
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
    const RADIAN = Math.PI / 180;
    // Push label out just enough to be clear but not clipped
    const radius = innerRadius + (outerRadius - innerRadius) * 2.2; 
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.03) return null; // Don't label very tiny slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="#4b5563" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-[10px] font-medium"
      >
        {name}
      </text>
    );
  };

  return (
    <div className="max-w-[900px] mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden font-sans border-[8px] border-white ring-1 ring-gray-100/50">
      
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-br from-piggy-400 to-piggy-600 text-white p-6 pb-14 relative overflow-hidden">
        {/* Soft abstract shapes */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-40 h-40 rounded-full bg-piggy-200 opacity-20 blur-2xl"></div>

        <div className="flex justify-between items-start relative z-10">
          
          {/* Calendar Block */}
          <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-4 w-20 h-24 flex flex-col items-center justify-center shadow-lg transform rotate-[-2deg]">
            <span className="text-3xl font-bold leading-none tracking-tighter">{monthStr}</span>
            <span className="text-[10px] mt-1 text-white/90 font-medium uppercase tracking-widest">{yearStr}</span>
          </div>

          {/* Title & Stats */}
          <div className="flex-1 ml-6 text-right">
             <div className="flex justify-end items-center gap-3 mb-6 opacity-90">
                <div className="h-[1px] w-6 bg-white/70"></div>
                <h1 className="text-lg tracking-[0.2em] font-medium text-white drop-shadow-sm">小猪理财日记</h1>
                <div className="h-[1px] w-6 bg-white/70"></div>
             </div>
             
             {/* Main KPI Card */}
             <div className="bg-white/95 backdrop-blur-sm text-gray-800 rounded-2xl px-6 py-5 shadow-xl grid grid-cols-2 gap-y-4 gap-x-8 text-center border border-white/50">
                <div className="border-r border-piggy-100">
                    <div className="text-[10px] text-gray-400 mb-0.5 tracking-wide">总金额(元)</div>
                    <div className="text-xl font-bold font-mono text-gray-800">{Math.round(totalAmount).toLocaleString()}</div>
                </div>
                <div>
                    <div className="text-[10px] text-gray-400 mb-0.5 tracking-wide">本月收益(元)</div>
                    <div className={`text-xl font-bold font-mono ${totalMonthlyGain >= 0 ? 'text-piggy-500' : 'text-green-500'}`}>
                        {totalMonthlyGain > 0 ? '+' : ''}{Math.round(totalMonthlyGain).toLocaleString()}
                    </div>
                </div>
                <div className="border-r border-piggy-100 border-t pt-3">
                    <div className="text-[10px] text-gray-400 mb-0.5 tracking-wide">本月收益率</div>
                    <div className={`text-lg font-bold font-mono ${monthlyYield >= 0 ? 'text-piggy-500' : 'text-green-500'}`}>
                        {formatPct(monthlyYield)}
                    </div>
                </div>
                <div className="border-t border-piggy-100 pt-3">
                    <div className="text-[10px] text-gray-400 mb-0.5 tracking-wide">累积收益及收益率</div>
                    <div className="flex flex-col items-center leading-none gap-1">
                        <span className={`text-sm font-bold font-mono ${totalCumulativeGain >= 0 ? 'text-piggy-500' : 'text-green-500'}`}>
                            {totalCumulativeGain > 0 ? '+' : ''}{toWan(totalCumulativeGain)}
                        </span>
                        <span className={`text-[10px] font-mono scale-90 opacity-80 ${totalYield >= 0 ? 'text-piggy-500' : 'text-green-500'}`}>
                            {formatPct(totalYield)}
                        </span>
                    </div>
                </div>
             </div>
          </div>
        </div>
        
        {/* Rounded cut-out effect */}
        <div className="absolute -bottom-1 left-0 right-0 h-6 bg-white rounded-t-[32px]"></div>
      </div>

      {/* --- BODY --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 px-6 pb-10 pt-2">
        
        {/* LEFT COLUMN: Visualizations */}
        <div className="md:col-span-4 flex flex-col gap-6">
          
          {/* Asset Allocation Chart */}
          <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
            <h3 className="text-center text-gray-400 font-medium mb-2 text-xs tracking-widest uppercase">
                 资产配置
            </h3>
            {/* Added extra vertical space to container to prevent label clipping */}
            <div className="h-72 relative -mx-4"> 
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <defs>
                    {Object.entries(CATEGORY_GRADIENTS).map(([key, grad]) => (
                      <linearGradient id={grad.id} key={key} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={grad.start} />
                        <stop offset="100%" stopColor={grad.end} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={pieData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    label={renderCustomizedLabel}
                    labelLine={true}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#${CATEGORY_GRADIENTS[entry.categoryKey as AssetCategory].id})`} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center Total */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                    <span className="text-[10px] text-gray-400 block">Total</span>
                    <span className="text-xs font-bold text-gray-600">{toWan(totalAmount)}</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Holding Analysis Bars - Clean Look */}
          <div className="bg-white">
            <h3 className="text-center text-gray-400 font-medium mb-4 text-xs tracking-widest uppercase">
                 持仓分析
            </h3>
            <div className="space-y-4 px-2">
               {(Object.entries(categoryStats) as [string, CategoryStat][]).map(([key, stat]) => {
                  const catKey = key as AssetCategory;
                  const label = CATEGORY_LABELS[catKey];
                  if (stat.amount === 0) return null;
                  
                  return (
                      <div key={key} className="flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                              <span>{label}</span>
                              <span className="font-mono">{toWan(stat.amount)}</span>
                          </div>
                          {/* Floating Gradient Bar without track background */}
                          <div className="h-2.5 rounded-full relative">
                              <div 
                                style={{ 
                                    width: `${Math.max(stat.percentage, 1)}%`, 
                                    background: `linear-gradient(to right, ${CATEGORY_GRADIENTS[catKey].start}, ${CATEGORY_GRADIENTS[catKey].end})`,
                                    boxShadow: `0 2px 4px ${CATEGORY_GRADIENTS[catKey].start}66`
                                }}
                                className="h-full rounded-full absolute left-0 top-0 transition-all duration-1000"
                              ></div>
                          </div>
                      </div>
                  )
               })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Table */}
        <div className="md:col-span-8 bg-piggy-50/40 rounded-3xl p-6 border border-piggy-100">
            <div className="flex items-center justify-center mb-6 gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-piggy-300"></span>
               <h3 className="text-gray-700 text-sm font-bold tracking-widest">本月收益明细</h3>
               <span className="w-1.5 h-1.5 rounded-full bg-piggy-300"></span>
            </div>

            <div className="space-y-6">
                 {/* Explicit Header Row */}
                 <div className="grid grid-cols-12 text-[10px] text-gray-400 border-b border-gray-200 pb-2 px-2 uppercase tracking-wide">
                    <div className="col-span-4">产品名称</div>
                    <div className="col-span-2 text-right">持有金额</div>
                    <div className="col-span-2 text-right">本月收益</div>
                    <div className="col-span-2 text-right">本月收益率</div>
                    <div className="col-span-2 text-center">累积收益/率</div>
                 </div>

                {(Object.keys(groupedPositions) as AssetCategory[]).map(cat => {
                    const items = groupedPositions[cat];
                    if (items.length === 0) return null;

                    return (
                        <div key={cat} className="group">
                            <div className="flex items-center gap-2 mb-2 mt-4 pl-1">
                                {/* Small colored dot indicator */}
                                <div className="w-2 h-2 rounded-full" style={{background: CATEGORY_GRADIENTS[cat].end}}></div>
                                <span className="text-gray-800 font-bold text-xs tracking-wide">{CATEGORY_LABELS[cat]}</span>
                            </div>
                            
                            <div className="bg-white border border-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                                <table className="w-full text-sm">
                                    <tbody>
                                        {items.map((item, idx) => {
                                            const itemMonthlyYield = item.amount !== 0 ? (item.monthlyGain / (item.amount - item.monthlyGain)) * 100 : 0;
                                            const itemTotalYield = item.amount !== 0 ? (item.totalGain / (item.amount - item.totalGain)) * 100 : 0;
                                            const isLast = idx === items.length - 1;

                                            return (
                                                <tr key={item.id} className={`${!isLast ? 'border-b border-gray-50' : ''} hover:bg-piggy-50/30 transition-colors`}>
                                                    {/* Product Name */}
                                                    <td className="py-3 pl-3 pr-1 text-gray-700 text-xs font-medium w-[33%]">
                                                        {item.name}
                                                    </td>
                                                    
                                                    {/* Amount */}
                                                    <td className="py-3 px-1 text-right font-mono text-xs text-gray-500 w-[16%]">
                                                        {toWan(item.amount).replace('万','')}
                                                    </td>

                                                    {/* Monthly Gain */}
                                                    <td className={`py-3 px-1 text-right font-mono text-xs w-[16%] ${item.monthlyGain >= 0 ? 'text-piggy-500' : 'text-green-600'}`}>
                                                        {item.monthlyGain > 0 ? '+' : ''}{item.monthlyGain === 0 ? '-' : Math.round(item.monthlyGain)}
                                                    </td>

                                                    {/* Monthly Yield */}
                                                    <td className={`py-3 px-1 text-right font-mono text-[10px] w-[16%] ${itemMonthlyYield >= 0 ? 'text-piggy-500' : 'text-green-600'}`}>
                                                        {formatPct(itemMonthlyYield)}
                                                    </td>

                                                    {/* Cumulative Gain/Yield */}
                                                    <td className="py-3 px-1 text-center w-[19%]">
                                                         <div className="flex flex-col items-center leading-none">
                                                             <span className={`text-[10px] font-mono font-bold ${item.totalGain >= 0 ? 'text-piggy-500' : 'text-green-600'}`}>
                                                                 {item.totalGain > 0 ? '+' : ''}{toWan(item.totalGain)}
                                                             </span>
                                                             <span className={`text-[9px] font-mono opacity-75 scale-90 mt-0.5 ${itemTotalYield >= 0 ? 'text-piggy-500' : 'text-green-600'}`}>
                                                                 {formatPct(itemTotalYield)}
                                                             </span>
                                                         </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
