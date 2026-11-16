"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const performanceData = [
  { name: "Mon", score: 3.8 }, { name: "Tue", score: 4.1 },
  { name: "Wed", score: 3.9 }, { name: "Thu", score: 4.5 },
  { name: "Fri", score: 4.2 }, { name: "Sat", score: 4.7 },
  { name: "Sun", score: 4.6 },
];

const agentData = [
  { name: "Accuracy", count: 420 }, { name: "Hallucination", count: 310 },
  { name: "Reasoning", count: 280 }, { name: "Safety", count: 238 },
];

export function DashboardCharts() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-5 rounded border border-border bg-surface h-80 flex flex-col">
        <h3 className="text-sm font-medium mb-6">Agent Activity</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agentData}>
              <XAxis dataKey="name" stroke="#52525B" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525B" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: '#27272A' }} contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', color: '#FAFAFA' }} />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-5 rounded border border-border bg-surface h-80 flex flex-col">
        <h3 className="text-sm font-medium mb-6">Performance Trend</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#52525B" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525B" fontSize={12} tickLine={false} axisLine={false} domain={[0, 5]} />
              <Tooltip contentStyle={{ backgroundColor: '#18181B', borderColor: '#27272A', color: '#FAFAFA' }} />
              <Area type="monotone" dataKey="score" stroke="#10B981" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}