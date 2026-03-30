import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { attendanceData, CHART_COLORS } from '../../../data/dashboard/ChartDashboard';

const AttendanceChart = () => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
    <h3 className="font-semibold mb-4 text-gray-700">Daily Attendance</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={attendanceData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="present" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
          <Bar dataKey="absent" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default AttendanceChart;