"use client";

import React, { useRef, useEffect } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  CartesianScaleOptions,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const AttendanceChart = ({ data }: { data: { name: string; value: number; fill: string }[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy chart เก่าก่อนสร้างใหม่
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: data.map((d) => d.name),
        datasets: [
          {
            data: data.map((d) => d.value),
            backgroundColor: data.map((d) => d.fill),
            hoverBackgroundColor: data.map((d) => d.fill),
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 45,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 200 },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ctx.raw as number > 0
                ? (ctx.raw as number).toLocaleString() + " คน"
                : "0 คน",
              title: () => "จำนวนพนักงาน",
            },
            displayColors: false,
            backgroundColor: "white",
            titleColor: "#475569",
            bodyColor: "#1e293b",
            bodyFont: { size: 14, weight: "bold" },
            borderColor: "rgba(0,0,0,0.08)",
            borderWidth: 1,
            padding: 12,
            cornerRadius: 12,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: "#64748b",
              font: { size: 12 },
            },
          },
          y: {
            grid: {
              color: "#f1f5f9",
            },
            border: { display: false },
            ticks: {
              color: "#64748b",
              font: { size: 12 },
              callback: (value) =>
                Number(value) >= 1000
                  ? `${Number(value) / 1000}k`
                  : value,
            },
          },
        },
        // Hover ขยายแท่ง
        onHover: (_, elements, chart) => {
          const canvas = chart.canvas;
          canvas.style.cursor = elements.length ? "pointer" : "default";
        },
      },
      plugins: [
        {
          id: "hoverGrow",
          beforeDatasetsDraw(chart) {
            const active = chart.getActiveElements();
            if (!active.length) return;

            const meta = chart.getDatasetMeta(0);
            active.forEach(({ index }) => {
              const bar = meta.data[index] as any;
              const scale = 1.05;
              const originalWidth = bar.width;
              bar.width = originalWidth * scale;
              bar.x = bar.x; // ให้อยู่กลางเดิม
            });
          },
          afterDatasetsDraw(chart) {
            const active = chart.getActiveElements();
            if (!active.length) return;

            // Reset กลับหลัง draw เสร็จ ไม่งั้น width จะค้าง
            const meta = chart.getDatasetMeta(0);
            active.forEach(({ index }) => {
              const bar = meta.data[index] as any;
              bar.width = bar.width / 1.05;
            });
          },
        },
      ],
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [data]);

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border-2 border-slate-300 h-full flex flex-col">
      <h3 className="font-semibold mb-4 text-slate-700 text-base italic">
        Current Attendance Status / Day
      </h3>
      <div className="flex-1 min-h-[260px] relative">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default AttendanceChart;