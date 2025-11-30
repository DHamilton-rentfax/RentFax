"use client";
import { motion } from "framer-motion";

interface DemoCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
}

export default function DemoCard({
  title,
  value,
  subtitle,
  icon,
  color = "emerald",
}: DemoCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-5 bg-white border border-gray-100 shadow-sm rounded-xl flex flex-col justify-between`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-gray-700">{title}</h4>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`text-${color}-600 text-3xl`}>{icon}</div>
      </div>
      {subtitle && <p className="text-gray-500 text-sm mt-2">{subtitle}</p>}
    </motion.div>
  );
}
