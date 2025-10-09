'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function BarChartComp({ data, dataKey, color }: any) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" /><YAxis /><Tooltip />
        <Bar dataKey={dataKey} fill={color || '#2563eb'} />
      </BarChart>
    </ResponsiveContainer>
  )
}
