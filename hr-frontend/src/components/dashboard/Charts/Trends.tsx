import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { trendData, CHART_COLORS } from '../../../data/dashboard/ChartDashboard';

const TrendChart = () => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
    <h3 className="font-semibold mb-4 text-gray-700">Performance Trends</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="performance" stroke={CHART_COLORS[1]} strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default TrendChart;