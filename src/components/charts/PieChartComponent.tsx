import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PieChartComponentProps {
  title: string;
  data: Array<{ name: string; value: number; color?: string }>;
  height?: number;
  showLegend?: boolean;
  innerRadius?: number;
}

const defaultColors = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(199, 89%, 48%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 60%)",
  "hsl(0, 84%, 60%)",
];

export function PieChartComponent({
  title,
  data,
  height = 300,
  showLegend = true,
  innerRadius = 0,
}: PieChartComponentProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              strokeWidth={2}
              stroke="hsl(var(--background))"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || defaultColors[index % defaultColors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, "Amount"]}
            />
            {showLegend && (
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span style={{ color: "hsl(var(--foreground))", fontSize: "12px" }}>
                    {value}
                  </span>
                )}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
