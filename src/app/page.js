"use client"

import { useState } from "react"
import Sidebar from "./components/layout/Sidebar/Sidebar"
import KellyCalculator from "./tools/kelly/components/KellyCalculator"
import DutchingCalculator from "./tools/dutching/DutchingCalculator"
import PortfolioExposureCalculator from "./tools/portfolio/PortfolioExposureCalculator"
import StockSearch from "./components/stock/StockSearch"
import CompareStocks from "./components/stock/CompareStock"
import StockMonteCarlo from "./components/montecarlo-simulations/StockMonteCarlo"

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
				{activeTool === "exposure" && <PortfolioExposureCalculator />}
				{activeTool === "stockInformation" && <StockSearch />}
				{activeTool === "stockcompare" && <CompareStocks />}
				{activeTool === "montecarlo" && <StockMonteCarlo />}

			</main>
		</div>
	)
}
