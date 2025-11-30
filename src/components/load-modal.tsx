"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useConfiguration } from "@/contexts/configuration-context"
import { loadDesigns, deleteDesign } from "@/lib/firestore"
import { toast } from "sonner"
import type { SiteConfiguration } from "@/contexts/configuration-context"
import { TrashIcon, Loader2Icon } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

interface LoadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoadModal({ open, onOpenChange }: LoadModalProps) {
  const { user } = useAuth()
  const { loadDesign } = useConfiguration()
  const [designs, setDesigns] = useState<SiteConfiguration[]>([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchDesigns = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const loadedDesigns = await loadDesigns(user.uid)
      setDesigns(loadedDesigns)
    } catch (error) {
      console.error("Error loading designs:", error)
      toast.error("Failed to load designs")
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (open && user) {
      fetchDesigns()
    }
  }, [open, user, fetchDesigns])

  const handleLoadDesign = (design: SiteConfiguration) => {
    loadDesign(design)
    toast.success(`Loaded design: ${design.name}`)
    onOpenChange(false)
  }

  const handleDeleteDesign = async (
    e: React.MouseEvent,
    designId: string,
    designName: string,
  ) => {
    e.stopPropagation()

    if (!user) return

    setDeletingId(designId)
    try {
      await deleteDesign(user.uid, designId)
      setDesigns(designs.filter((d) => d.id !== designId))
      toast.success(`Deleted design: ${designName}`)
    } catch (error) {
      console.error("Error deleting design:", error)
      toast.error("Failed to delete design")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Load Design</DialogTitle>
          <DialogDescription>Select a saved design to load</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2Icon className="text-muted-foreground h-8 w-8 animate-spin" />
            </div>
          ) : designs.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center">
              <p className="mb-2">No saved designs found</p>
              <p className="text-sm">
                Create a design and click Save to store it in the cloud
              </p>
            </div>
          ) : (
            designs.map((design) => (
              <div
                key={design.id}
                className="bg-card group hover:bg-muted/50 flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 transition-colors"
                onClick={() => handleLoadDesign(design)}
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="line-clamp-2 text-lg font-semibold">
                        {design.name}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        {formatDate(design.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div>
                      <span className="text-muted-foreground">Batteries:</span>{" "}
                      <span className="font-medium">
                        {design.totalBatteries}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Energy:</span>{" "}
                      <span className="font-medium">
                        {design.energyProduction} MWh
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cost:</span>{" "}
                      <span className="font-medium">
                        {formatCurrency(design.cost)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Layout:</span>{" "}
                      <span className="font-medium">
                        {design.manualPackingEnabled ? "Manual" : "Auto"}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) =>
                    handleDeleteDesign(e, design.id!, design.name!)
                  }
                  disabled={deletingId === design.id}
                >
                  {deletingId === design.id ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <TrashIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
