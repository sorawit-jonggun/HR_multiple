import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// รับ 'data' ผ่าน props แทนการ import ตรงๆ
const LeaveChart = ({ data = [] }) => {
  
  const chartData = {
    labels: data.map((item) => item.name || item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        // ใช้สีจากข้อมูลแต่ละชุดโดยตรง (ถ้ามี) หรือ fallback เป็นสีมาตรฐาน
        backgroundColor: data.map((item) => item.color || "#3B82F6"),
        hoverBackgroundColor: data.map((item) => (item.color || "#3B82F6") + "CC"),
        borderWidth: 0,
        borderRadius: 10,
        hoverOffset: 6,
        spacing: 4, // ลด spacing ลงหน่อยเพื่อให้วงไม่แตกมากเมื่อรายการเยอะ
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "85%", // ขยายรูตรงกลางให้กว้างขึ้นดู modern
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 10,
      },
    },
  };

  // คำนวณยอดรวมเพื่อแสดงตรงกลาง (Optional)
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="font-semibold mb-4 text-gray-700 text-base italic">
        Leave Distribution
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 flex-1 gap-4 overflow-hidden">
        {/* คอลัมน์ซ้าย: Custom Legend (ปรับให้เลื่อนได้ถ้ารายการยาว) */}
        <div className="flex flex-col justify-center gap-2 overflow-y-auto max-h-[200px] pr-2 custom-scrollbar">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: item.color || "#3B82F6",
                }}
              />
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                {item.name || item.label}
              </span>
            </div>
          ))}
        </div>

        {/* คอลัมน์ขวา: กราฟ */}
        <div className="relative h-40 w-40 sm:h-48 sm:w-48 mx-auto self-center">
          <Doughnut data={chartData} options={options} />
          {/* ส่วนแสดงตัวเลขรวมตรงกลางกราฟ */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-gray-800 leading-none">{total}</span>
            <span className="text-[10px] text-gray-400 font-semibold uppercase">Days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveChart;