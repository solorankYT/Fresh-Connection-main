import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer
} from "recharts";

export default function ProductVelocityChart({ data }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid />
          
          <XAxis 
            type="number" 
            dataKey="total_quantity" 
            name="Quantity Sold (6 Months)"
          />

          <YAxis 
            type="number" 
            dataKey="days_since_last_sale" 
            name="Days Since Last Sale" 
          />

          {/* Quadrant lines */}
          <ReferenceLine x={50} stroke="red" />
          <ReferenceLine y={30} stroke="red" />

          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="Products" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
