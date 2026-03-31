import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { CHART_COLORS } from '@/data/dashboard/ChartDashboard';

const TrendChart = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border-2 border-slate-300 h-full flex flex-col">
      <h3 className="font-semibold mb-4 text-slate-700 text-base italic tracking-tight">
        Performance Trends / Monthly
      </h3>
      <div className="flex-1 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 35, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              // ปรับเลขหลักแสนให้เป็นหน่วย k (เช่น 80,000 -> 80k)
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                fontSize: '13px'
              }}
              formatter={(value: number) => [value.toLocaleString(), "Total Performance"]}
            />
            <Line 
              type="monotone" 
              dataKey="performance" 
              stroke={CHART_COLORS[0]} // สีน้ำเงินหลัก
              strokeWidth={4} 
              dot={{ r: 4, fill: "#fff", strokeWidth: 3, stroke: CHART_COLORS[0] }} 
              activeDot={{ r: 7, strokeWidth: 0, fill: CHART_COLORS[0] }}
              animationDuration={1500}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;