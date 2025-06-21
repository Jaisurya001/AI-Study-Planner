"use client"

import type React from "react"

import { useState } from "react"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface AuthDialogProps {
  type: "login" | "signup"
}

export default function AuthDialog({ type }: AuthDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // This is a frontend-only demo, so no actual auth logic.
    // In a real app, you'd send these credentials to your backend.
    toast({
      title: `${type === "login" ? "Login" : "Sign Up"} Attempted`,
      description: `Email: ${email}, Password: ${password}. (No actual auth)`,
    })
    console.log(`${type} attempt with:`, { email, password })
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{type === "login" ? "Login" : "Sign Up"}</DialogTitle>
        <DialogDescription>
          {type === "login"
            ? "Enter your credentials to access your study companion."
            : "Create an account to start managing your study plan."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-black text-white">
            {type === "login" ? "Login" : "Sign Up"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
