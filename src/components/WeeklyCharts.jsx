import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function WeeklyChart({ tasks }) {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const data = days.map(day => {
    const dayTasks = tasks.filter(t => {
      if (!t.createdAt) return false;
      const d = new Date(t.createdAt).toLocaleString("en-US", { weekday: "short" });
      return d === day;
    });

    return {
      name: day,
      total: dayTasks.length || 0.4,
      completed: dayTasks.filter(t => t.completed).length || 0
    };
  });

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 30, bottom: 20 }}
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="grayGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9ca3af" />
              <stop offset="100%" stopColor="#4b5563" />
            </linearGradient>

            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
          </defs>

          {/* Soft grid */}
          <CartesianGrid stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />

          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip
            formatter={(value) => (value === 0.4 ? 0 : value)}
            contentStyle={{
              backgroundColor: "rgba(30,41,59,0.85)",
              border: "none",
              borderRadius: "8px",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
            }}
            labelStyle={{ color: "#e5e7eb", fontWeight: 600 }}
          />
          <Legend verticalAlign="top" align="right" />

          {/* Bars */}
          <Bar dataKey="total" fill="url(#grayGradient)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="completed" fill="url(#greenGradient)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
