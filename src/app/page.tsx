import { SummaryPanel } from "@/components/summary-panel"
import { SiteLayoutBuilder } from "@/components/site-layout-builder"

export default function Home() {
  return (
    <main className="m-4 flex h-screen flex-col gap-4">
      <SummaryPanel />
      <SiteLayoutBuilder />
    </main>
  )
}
