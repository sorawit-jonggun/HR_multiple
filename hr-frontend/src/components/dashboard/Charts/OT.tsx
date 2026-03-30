import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CHART_COLORS } from '../../../data/dashboard/ChartDashboard';

// เปลี่ยนจากค่าคงที่มาเป็นรับ 'data' ผ่าน props
const OTChart = ({ data = [] }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="font-semibold mb-4 text-gray-700 text-base italic">
        OT by Dept (Hours)
      </h3>
      <div className="flex-1 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            layout="vertical" 
            data={data} 
            margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="dept" // ตรวจสอบว่าในข้อมูลใช้ชื่อ 'dept' หรือ 'department'
              type="category" 
              width={100} 
              tick={{ fontSize: 12, fontWeight: 500, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }} 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '13px'
              }}
              formatter={(value) => [`${value} Hours`, 'OT Amount']}
            />
            <Bar 
              dataKey="hours" 
              radius={[0, 6, 6, 0]} 
              barSize={24}
            >
              {/* ใช้ข้อมูลจาก props มาวนลูปสร้าง Cell สี */}
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CHART_COLORS[index % CHART_COLORS.length]} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OTChart;