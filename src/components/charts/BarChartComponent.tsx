import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BarChartComponentProps {
  title: string;
  data: Array<{ [key: string]: string | number }>;
  dataKey: string;
  xAxisKey: string;
  colors?: string[];
  height?: number;
  horizontal?: boolean;
}

const defaultColors = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(199, 89%, 48%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 60%)",
];

export function BarChartComponent({
  title,
  data,
  dataKey,
  xAxisKey,
  colors = defaultColors,
  height = 300,
  horizontal = false,
}: BarChartComponentProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            layout={horizontal ? "vertical" : "horizontal"}
            margin={{ top: 10, right: 10, left: horizontal ? 80 : 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={!horizontal}
              vertical={horizontal}
              stroke="hsl(var(--border))"
            />
            {horizontal ? (
              <>
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) =>
                    value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
                  }
                />
                <YAxis
                  type="category"
                  dataKey={xAxisKey}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  width={70}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey={xAxisKey}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) =>
                    value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
                  }
                  dx={-10}
                />
              </>
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 500 }}
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
            />
            <Bar dataKey={dataKey} radius={[4, 4, 0, 0]} maxBarSize={50}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
