"use client"

import { useMemo, useState, memo, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useConfiguration } from "@/contexts/configuration-context"
import {
  BATTERY_TYPES,
  TRANSFORMER_TYPES,
  BatteryType,
  BATTERY_SCALE,
  VIEWPORT_HEIGHT,
  VIEWPORT_BUFFER,
  MAX_ROW_WIDTH,
} from "@/lib/constants"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  calculateAutoPackedLayout,
  calculateManualLayout,
  PlacedBattery,
} from "@/lib/utils"

const BatteryVisual = memo(
  ({
    battery,
    isDragging = false,
    style = {},
    enableDrag = true,
  }: {
    battery: BatteryType
    isDragging?: boolean
    style?: React.CSSProperties
    enableDrag?: boolean
  }) => {
    const cursorClass = enableDrag
      ? isDragging
        ? "cursor-grabbing"
        : "cursor-grab"
      : "cursor-default"

    return (
      <div
        style={{
          width: `${battery.length * BATTERY_SCALE - 2}px`,
          height: `${battery.width * BATTERY_SCALE - 2}px`,
          ...style,
        }}
        className={`flex items-center justify-center rounded font-semibold text-white select-none ${battery.color} ${cursorClass} ${
          isDragging
            ? "opacity-70"
            : "opacity-85 transition-opacity hover:opacity-100"
        }`}
      >
        <span
          className="text-xs"
          style={{
            fontSize: Math.min((battery.length * BATTERY_SCALE) / 8, 11),
          }}
        >
          {battery.name}
        </span>
      </div>
    )
  },
)

BatteryVisual.displayName = "BatteryVisual"

const SortableBattery = memo(
  ({
    item,
    useDragOverlay,
    enableDrag,
  }: {
    item: PlacedBattery
    useDragOverlay?: boolean
    enableDrag?: boolean
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: item.id,
    })

    const style: React.CSSProperties = {
      position: "absolute",
      left: `${30 + item.x * BATTERY_SCALE}px`,
      top: `${30 + item.y * BATTERY_SCALE}px`,
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      transition,
      opacity: isDragging && useDragOverlay ? 0 : isDragging ? 0.3 : 1,
      zIndex: isDragging ? 999 : 1,
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...(enableDrag ? attributes : {})}
        {...(enableDrag ? listeners : {})}
      >
        <BatteryVisual
          battery={item.battery}
          isDragging={isDragging}
          enableDrag={enableDrag}
        />
      </div>
    )
  },
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.item.x === next.item.x &&
    prev.item.y === next.item.y &&
    prev.enableDrag === next.enableDrag,
)
SortableBattery.displayName = "SortableBattery"

export function LayoutDisplay() {
  const { config, updateAreaOccupied } = useConfiguration()
  const [autoPackEnabled, setAutoPackEnabled] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [scrollTop, setScrollTop] = useState(0)

  // Create items list from config
  const configItems = useMemo(() => {
    const items: Array<{ id: string; battery: BatteryType }> = []

    for (const battery of [...BATTERY_TYPES, ...TRANSFORMER_TYPES]) {
      const count = config.batteryDetails[battery.id] || 0
      for (let i = 0; i < count; i++) {
        items.push({
          id: `${battery.id}-${i}`,
          battery,
        })
      }
    }

    return items
  }, [config.batteryDetails])

  const [items, setItems] = useState(configItems)

  // Reset items when config changes
  useEffect(() => {
    setItems(configItems)
  }, [configItems])

  const placedBatteries = useMemo(
    () =>
      autoPackEnabled
        ? calculateAutoPackedLayout(items)
        : calculateManualLayout(items),
    [items, autoPackEnabled],
  )

  // Calculate layout dimensions
  const layoutDimensions = useMemo(() => {
    if (placedBatteries.length === 0) {
      return { maxWidth: 0, maxLength: 0 }
    }

    const maxWidth = placedBatteries.reduce(
      (max, item) => Math.max(max, item.x + item.battery.length),
      0,
    )

    const maxLength = placedBatteries.reduce(
      (max, item) => Math.max(max, item.y + item.battery.width),
      0,
    )

    return { maxWidth, maxLength }
  }, [placedBatteries])

  // Update area occupied in configuration context whenever layout dimensions change
  useEffect(() => {
    updateAreaOccupied(layoutDimensions.maxLength, layoutDimensions.maxWidth)
  }, [layoutDimensions, updateAreaOccupied])

  // Calculate visible batteries based on scroll position (viewport virtualization)
  const visibleBatteries = useMemo(() => {
    // If less than 500 batteries, render all
    if (placedBatteries.length < 500) {
      return placedBatteries
    }

    const viewportTop = scrollTop
    const viewportBottom = scrollTop + VIEWPORT_HEIGHT

    return placedBatteries.filter((item) => {
      const itemTop = 30 + item.y * BATTERY_SCALE
      const itemBottom = itemTop + item.battery.width * BATTERY_SCALE

      // Include items in viewport + buffer zone
      return (
        itemBottom >= viewportTop - VIEWPORT_BUFFER &&
        itemTop <= viewportBottom + VIEWPORT_BUFFER
      )
    })
  }, [placedBatteries, scrollTop])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setItems((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id)

      if (!over) {
        // Dropped in empty space - move to end of list
        if (oldIndex === items.length - 1) {
          // Already at the end, no change needed
          return items
        }
        const newItems = [...items]
        const [movedItem] = newItems.splice(oldIndex, 1)
        newItems.push(movedItem)
        return newItems
      }

      if (active.id !== over.id) {
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      }

      return items
    })

    setActiveId(null)
  }

  // Get the active battery for the drag overlay
  const activeBattery = activeId
    ? placedBatteries.find((item) => item.id === activeId)
    : null

  const containerHeight = Math.max(
    (layoutDimensions.maxLength + 10) * BATTERY_SCALE + 60,
    400,
  )
  const containerWidth = MAX_ROW_WIDTH * BATTERY_SCALE + 60

  // Disable drag-and-drop when auto-packing is enabled or for large counts
  const enableDragDrop = !autoPackEnabled && placedBatteries.length < 1000

  // Force auto-packing ON for large counts
  const effectiveAutoPackEnabled =
    autoPackEnabled || placedBatteries.length >= 1000

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="bg-card flex items-center gap-3 rounded-lg border p-4">
        <Switch
          id="auto-pack"
          checked={effectiveAutoPackEnabled}
          onCheckedChange={setAutoPackEnabled}
          disabled={placedBatteries.length >= 1000}
        />
        <Label htmlFor="auto-pack" className="cursor-pointer">
          <div className="font-medium">Optimal Packing</div>
          <div className="text-muted-foreground text-xs">
            {effectiveAutoPackEnabled
              ? "Batteries are automatically arranged for optimal space usage"
              : "Drag and drop to manually arrange batteries"}
          </div>
        </Label>
        {placedBatteries.length >= 1000 && (
          <div className="ml-auto text-xs text-amber-600 dark:text-amber-500">
            Optimal packing locked due to 1000+ batteries
          </div>
        )}
      </div>

      <div
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        className="bg-muted/30 flex max-h-[600px] w-full justify-center overflow-auto rounded-lg border py-4"
      >
        <DndContext
          sensors={enableDragDrop ? sensors : []}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={placedBatteries.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div
              className="relative"
              style={{
                width: containerWidth,
                height: containerHeight,
                minHeight: 400,
              }}
            >
              <div
                className="text-muted-foreground absolute top-0 right-0 left-0 text-center text-xs font-medium"
                style={{ left: 30, right: 30 }}
              >
                Width constraint: {MAX_ROW_WIDTH} ft
              </div>

              <div
                className="border-muted-foreground/20 absolute border-r-2 border-l-2"
                style={{
                  left: 30,
                  top: 30,
                  width: MAX_ROW_WIDTH * BATTERY_SCALE,
                  height: containerHeight - 60,
                }}
              />

              {visibleBatteries.map((item) => (
                <SortableBattery
                  key={item.id}
                  item={item}
                  useDragOverlay={enableDragDrop}
                  enableDrag={enableDragDrop}
                />
              ))}
            </div>
          </SortableContext>
          {enableDragDrop && (
            <DragOverlay dropAnimation={null}>
              {activeBattery ? (
                <BatteryVisual
                  battery={activeBattery.battery}
                  isDragging={true}
                  enableDrag={true}
                  style={{ cursor: "grabbing" }}
                />
              ) : null}
            </DragOverlay>
          )}
        </DndContext>
      </div>
    </div>
  )
}
