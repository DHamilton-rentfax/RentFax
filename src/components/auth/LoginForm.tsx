'use client'

export default function LoginForm() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <input type="email" placeholder="Email" className="border p-2 rounded" />
      <input type="password" placeholder="Password" className="border p-2 rounded" />
      <button className="bg-blue-600 text-white rounded p-2">Login</button>
    </div>
  )
}
