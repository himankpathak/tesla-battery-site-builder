"use client"
import { useState } from "react"
import { useConfiguration } from "@/contexts/configuration-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DollarSignIcon,
  BatteryCharging,
  Ruler,
  LucideIcon,
  ChevronRight,
} from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { BreakdownModal } from "@/components/breakdown-modal"

export function SummaryPanel() {
  const { config } = useConfiguration()
  const [modalType, setModalType] = useState<"cost" | "energy" | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setModalType(null), 200)
  }
  const handleOpenModal = (type: "cost" | "energy") => {
    setModalType(type)
    setIsOpen(true)
  }
  const landArea = config.lengthOccupied * config.widthOccupied

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <RenderCard
          Icon={DollarSignIcon}
          title="Total Cost"
          value={formatCurrency(config.cost)}
          tooltipValue={`Total Cost: ${config.cost.toLocaleString()} USD`}
          onClickCard={() => handleOpenModal("cost")}
        />
        <RenderCard
          Icon={BatteryCharging}
          title="Energy Production"
          value={`${config.energyProduction.toLocaleString()} MWh`}
          tooltipValue={`Total batteries: ${config.totalBatteries} batteries`}
          onClickCard={() => handleOpenModal("energy")}
        />
        <RenderCard
          Icon={Ruler}
          title="Land Area Required"
          value={`${config.lengthOccupied} ft x ${config.widthOccupied} ft`}
          tooltipValue={`Total Area: ${landArea.toLocaleString()} sq ft`}
        />
      </div>

      <BreakdownModal isOpen={isOpen} onClose={handleClose} type={modalType!} />
    </>
  )
}

interface RenderCardProps {
  Icon: LucideIcon
  title: React.ReactNode
  value: string
  tooltipValue: string
  onClickCard?: () => void
}
function RenderCard({
  Icon,
  title,
  value,
  tooltipValue,
  onClickCard,
}: RenderCardProps) {
  return (
    <Card
      className={cn("w-full", onClickCard && "cursor-pointer")}
      onClick={onClickCard}
    >
      <CardHeader>
        <CardTitle className="text-muted-foreground text-md flex items-center justify-between gap-2 font-medium">
          <span className="flex items-center gap-2">
            <Icon className="h-6 w-6" />
            <span>{title}</span>
          </span>

          {onClickCard && <ChevronRight className="h-6 w-6" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tooltip>
          <TooltipTrigger>
            <p className="text-2xl font-bold">{value}</p>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipValue}</p>
          </TooltipContent>
        </Tooltip>
        {onClickCard && (
          <p className="text-muted-foreground mt-2 text-xs">
            Click for breakdown
          </p>
        )}
      </CardContent>
    </Card>
  )
}
