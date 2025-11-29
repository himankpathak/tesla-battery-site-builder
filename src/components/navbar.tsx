import { Zap } from "lucide-react"
import ThemeToggle from "./theme-toggle"

export default function Navbar() {
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
      <div>
        <ThemeToggle />
      </div>
    </nav>
  )
}
