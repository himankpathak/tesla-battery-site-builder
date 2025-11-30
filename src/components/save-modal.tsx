"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { saveDesign } from "@/lib/firestore"
import { toast } from "sonner"
import type { SiteConfiguration } from "@/contexts/configuration-context"
import { formatCurrency } from "@/lib/utils"
import { Spinner } from "./ui/spinner"

interface SaveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: SiteConfiguration
}

export function SaveModal({ open, onOpenChange, config }: SaveModalProps) {
  const { user } = useAuth()
  const [designName, setDesignName] = useState(config.name || "")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!user) {
      toast.error("Please sign in to save designs")
      return
    }

    if (!designName.trim()) {
      toast.error("Please enter a design name")
      return
    }

    setLoading(true)
    try {
      const designToSave: SiteConfiguration = {
        ...config,
        name: designName.trim(),
      }

      await saveDesign(user.uid, designToSave)
      onOpenChange(false)
      setDesignName("")
    } catch (error) {
      console.error("Error saving design:", error)
      toast.error("Failed to save design. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Design</DialogTitle>
          <DialogDescription>
            Give your battery site design a name to save it to the cloud
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="design-name">Design Name</Label>
            <Input
              id="design-name"
              placeholder="Enter design name"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleSave()
                }
              }}
            />
          </div>

          <div className="bg-muted rounded-lg p-4">
            <h4 className="mb-2 text-sm font-medium">Design Summary</h4>
            <div className="text-muted-foreground space-y-1 text-sm">
              <p>Total Batteries: {config.totalBatteries}</p>
              <p>Total Cost: {formatCurrency(config.cost)}</p>
              <p>Energy Production: {config.energyProduction} MWh</p>
              <p>
                Layout Mode:{" "}
                {config.manualPackingEnabled ? "Manual" : "Optimal Packing"}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Spinner /> : "Save Design"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
