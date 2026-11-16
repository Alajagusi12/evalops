"use client";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const axis = { stroke: "#52525B", fontSize: 12, tickLine: false, axisLine: false } as const;
const tip = { contentStyle: { backgroundColor: "#18181B", borderColor: "#27272A", color: "#FAFAFA", borderRadius: 6 } };

export function AreaTrend({ data, x, y, color = "#10B981", domain }: { data: any[]; x: string; y: string; color?: string; domain?: [number, number] }) {
  const id = `g-${y}-${color.slice(1)}`;
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.3} /><stop offset="95%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
          <CartesianGrid stroke="#27272A" vertical={false} />
          <XAxis dataKey={x} {...axis} /><YAxis {...axis} domain={domain} />
          <Tooltip {...tip} />
          <Area type="monotone" dataKey={y} stroke={color} strokeWidth={2} fill={`url(#${id})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarsChart({ data, x, y, color = "#6366F1", domain }: { data: any[]; x: string; y: string; color?: string; domain?: [number, number] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#27272A" vertical={false} />
          <XAxis dataKey={x} {...axis} /><YAxis {...axis} domain={domain} />
          <Tooltip {...tip} cursor={{ fill: "#27272A" }} />
          <Bar dataKey={y} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
