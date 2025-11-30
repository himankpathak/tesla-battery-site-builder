"use client"
import { useState } from "react"
import { Zap } from "lucide-react"
import ThemeToggle from "./theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User } from "lucide-react"
import { AuthModal } from "./auth-modal"

export default function Navbar() {
  const { user, loading, logout } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  return (
    <nav className="bg-card flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-4">
        <div className="bg-primary rounded-lg p-2">
          <Zap />
        </div>
        <div>
          <h1 className="text-xl font-bold">Tesla Battery Site Planner</h1>
          <p className="text-muted-foreground text-md">
            Industrial Energy Storage Layout Tool
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {loading ? (
          <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border">
                  <AvatarImage
                    src={user.photoURL || undefined}
                    alt={user.displayName || ""}
                  />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-muted-foreground text-xs">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => setAuthModalOpen(true)}>
            <User className="h-4 w-4" />
            Sign In
          </Button>
        )}
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </nav>
  )
}
