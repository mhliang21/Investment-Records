
import React, { useState } from 'react';
import { AssetPosition, AssetCategory, CATEGORY_LABELS } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface AssetFormProps {
  positions: AssetPosition[];
  onUpdate: (positions: AssetPosition[]) => void;
  onDateChange: (date: string) => void;
  date: string;
}

const AssetForm: React.FC<AssetFormProps> = ({ positions, onUpdate, date, onDateChange }) => {
  const [newPosition, setNewPosition] = useState<Partial<AssetPosition>>({
    category: 'AH_Stock',
    amount: 0,
    monthlyGain: 0,
    totalGain: 0,
    name: ''
  });

  const handleAdd = () => {
    if (!newPosition.name) return;
    
    const item: AssetPosition = {
      id: Date.now().toString(),
      name: newPosition.name,
      category: newPosition.category as AssetCategory,
      amount: Number(newPosition.amount) || 0,
      monthlyGain: Number(newPosition.monthlyGain) || 0,
      totalGain: Number(newPosition.totalGain) || 0,
    };

    onUpdate([...positions, item]);
    setNewPosition({
      category: 'AH_Stock',
      amount: 0,
      monthlyGain: 0,
      totalGain: 0,
      name: ''
    });
  };

  const handleDelete = (id: string) => {
    onUpdate(positions.filter(p => p.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>📝</span> 本月数据录入
      </h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">月份 (Month)</label>
        <input 
          type="month" 
          value={date.substring(0, 7)}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
        />
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 bg-gray-50 p-4 rounded-xl">
          <div className="lg:col-span-1">
             <label className="text-xs text-gray-500 block mb-1">分类</label>
             <select 
              className="w-full p-2 border rounded-md text-sm"
              value={newPosition.category}
              onChange={(e) => setNewPosition({...newPosition, category: e.target.value as AssetCategory})}
            >
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-1">
            <label className="text-xs text-gray-500 block mb-1">名称</label>
            <input 
              type="text" 
              placeholder="基金名称"
              className="w-full p-2 border rounded-md text-sm"
              value={newPosition.name}
              onChange={(e) => setNewPosition({...newPosition, name: e.target.value})}
            />
          </div>
          <div className="lg:col-span-1">
             <label className="text-xs text-gray-500 block mb-1">总金额</label>
             <input 
              type="number" 
              className="w-full p-2 border rounded-md text-sm"
              value={newPosition.amount || ''}
              onChange={(e) => setNewPosition({...newPosition, amount: parseFloat(e.target.value)})}
            />
          </div>
          <div className="lg:col-span-1">
             <label className="text-xs text-gray-500 block mb-1">本月收益</label>
             <input 
              type="number" 
              className="w-full p-2 border rounded-md text-sm"
              value={newPosition.monthlyGain || ''}
              onChange={(e) => setNewPosition({...newPosition, monthlyGain: parseFloat(e.target.value)})}
            />
          </div>
          <div className="lg:col-span-1">
             <label className="text-xs text-gray-500 block mb-1">累积总收益</label>
             <input 
              type="number" 
              className="w-full p-2 border rounded-md text-sm"
              value={newPosition.totalGain || ''}
              onChange={(e) => setNewPosition({...newPosition, totalGain: parseFloat(e.target.value)})}
            />
          </div>
          <div className="lg:col-span-1 flex items-end">
            <button 
              onClick={handleAdd}
              className="w-full bg-rose-500 text-white p-2 rounded-md hover:bg-rose-600 transition flex items-center justify-center gap-1"
            >
              <Plus size={16} /> 添加
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">名称</th>
              <th className="px-4 py-3">分类</th>
              <th className="px-4 py-3 text-right">金额</th>
              <th className="px-4 py-3 text-right">本月收益</th>
              <th className="px-4 py-3 text-right">累积收益</th>
              <th className="px-4 py-3 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {positions.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">暂无数据</td>
              </tr>
            )}
            {positions.map((pos) => (
              <tr key={pos.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{pos.name}</td>
                <td className="px-4 py-3 text-gray-500">{CATEGORY_LABELS[pos.category]}</td>
                <td className="px-4 py-3 text-right">{pos.amount.toLocaleString()}</td>
                <td className={`px-4 py-3 text-right ${pos.monthlyGain >= 0 ? 'text-rose-500' : 'text-green-600'}`}>
                  {pos.monthlyGain > 0 ? '+' : ''}{pos.monthlyGain.toLocaleString()}
                </td>
                 <td className={`px-4 py-3 text-right ${pos.totalGain >= 0 ? 'text-rose-500' : 'text-green-600'}`}>
                  {pos.totalGain > 0 ? '+' : ''}{pos.totalGain.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <button 
                    onClick={() => handleDelete(pos.id)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetForm;
