"use client"

import { useState } from "react"
import Sidebar from "./components/layout/Sidebar/Sidebar"
import KellyCalculator from "./tools/kelly/components/KellyCalculator"
import DutchingCalculator from "./tools/dutching/DutchingCalculator"


export default function HomePage() {
	const [activeTool, setActiveTool] = useState("kelly")
	return (
		<div className="flex min-h-screen">
			<Sidebar
				activeTool={activeTool}
				onSelect={setActiveTool}
			/>

			<main className="flex-1 p-10">
				{activeTool === "kelly" && <KellyCalculator />}
        {activeTool === "dutching" && <DutchingCalculator />}
			</main>
		</div>
	)
}
