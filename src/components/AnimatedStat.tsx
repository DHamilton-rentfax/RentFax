'use client'
import { useEffect, useState } from 'react'

export function AnimatedStat({ target, label }: { target:number; label:string }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i += Math.ceil(target/60)
      if (i >= target) { setValue(target); clearInterval(interval) } else setValue(i)
    }, 15)
    return () => clearInterval(interval)
  }, [target])
  
  return (
    <div className="text-center p-4 bg-white rounded-xl shadow">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  )
}
