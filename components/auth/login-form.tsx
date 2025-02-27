"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const [loginType, setLoginType] = useState("email")
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null) 

    try {
      const req = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      })

      const res = await req.json()

      if (!req.ok) {
        setError(res.error || "Invalid login")
        return
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", JSON.stringify(res.user.id));
        localStorage.setItem("donor",res.user.donor);
      }

      router.push("/") 
    } catch (err) {
      console.error("Error:", err)
      setError("Something went wrong. Try again.")
    }
  }

  return (
    <Card className="bg-gray-800/20 border-gray-700/30 backdrop-blur-sm shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
          Login to BloodLink
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex justify-center space-x-4">
          <Button
            type="button"
            variant={loginType === "email" ? "default" : "outline"}
            onClick={() => setLoginType("email")}
            className={`${
              loginType === "email"
                ? "bg-gradient-to-r from-red-500 to-orange-500"
                : "border-red-500 text-red-500"
            }`}
          >
            Email
          </Button>
          <Button
            type="button"
            variant={loginType === "phone" ? "default" : "outline"}
            onClick={() => setLoginType("phone")}
            className={`${
              loginType === "phone"
                ? "bg-gradient-to-r from-red-500 to-orange-500"
                : "border-red-500 text-red-500"
            }`}
          >
            Phone
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier" className="text-gray-100">
              {loginType === "email" ? "Email" : "Phone Number"}
            </Label>
            <Input
              id="identifier"
              type={loginType === "email" ? "email" : "tel"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="bg-gray-700/30 border-gray-600/50 text-white placeholder-gray-400"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-100">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700/30 border-gray-600/50 text-white placeholder-gray-400"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-none mt-6"
          >
            Login
          </Button>
        </form>
        <div className="mt-6 text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-red-400 hover:text-red-300">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
