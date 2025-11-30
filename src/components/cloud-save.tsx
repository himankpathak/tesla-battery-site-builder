"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useConfiguration } from "@/contexts/configuration-context"
import { Button } from "@/components/ui/button"
import {
  CloudIcon,
  DownloadIcon,
  RotateCcwIcon,
  CloudUpload,
} from "lucide-react"
import { SaveModal } from "./save-modal"
import { LoadModal } from "./load-modal"
import { toast } from "sonner"

export function CloudSave() {
  const { user } = useAuth()
  const { config, resetConfig } = useConfiguration()
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [loadModalOpen, setLoadModalOpen] = useState(false)

  const isDesignEmpty = config.totalBatteries === 0

  const handleReset = () => {
    resetConfig()
    toast.success("Design reset successfully")
  }

  const handleLoadClick = () => {
    if (!user) {
      toast.error("Please sign in to load designs")
      return
    }
    setLoadModalOpen(true)
  }

  const handleSaveClick = () => {
    if (!user) {
      toast.error("Please sign in to save designs")
      return
    }
    if (isDesignEmpty) {
      toast.error("Cannot save an empty design")
      return
    }
    setSaveModalOpen(true)
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-medium">Summary</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleLoadClick}>
            <DownloadIcon className="mr-1 h-4 w-4" />
            Load
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveClick}
            disabled={isDesignEmpty}
          >
            <CloudUpload className="mr-1 h-4 w-4" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isDesignEmpty}
          >
            <RotateCcwIcon className="mr-1 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <SaveModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        config={config}
      />
      <LoadModal open={loadModalOpen} onOpenChange={setLoadModalOpen} />
    </>
  )
}
