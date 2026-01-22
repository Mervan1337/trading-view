"use client"

import { useState } from "react"
import StockCompareSearch from "./StockCompareSearch"
import StockCompareTable from "./StockCompareTable"
import StockCompareAnalysis from "./StockCompareAnalysis"
import { analyzeStocks } from "../../tools/analyzer/StockAnalyzer"

export default function StockCompare() {
	const [stockA, setStockA] = useState(null)
	const [stockB, setStockB] = useState(null)
	const [analysis, setAnalysis] = useState([])

	function runAnalysis() {
		if (!stockA || !stockB) return
		setAnalysis(analyzeStocks(stockA, stockB))
	}

	return (
		<div className="p-6 text-white">
			<h2 className="text-xl font-bold mb-4">Stock Comparison</h2>

			<div className="grid grid-cols-2 gap-4 mb-6">
				<StockCompareSearch label="Stock A" onSelect={setStockA} />
				<StockCompareSearch label="Stock B" onSelect={setStockB} />
			</div>

			{stockA && stockB && (
				<>
					<StockCompareTable a={stockA} b={stockB} />

					<button
						onClick={runAnalysis}
						className="mt-4 bg-blue-600 px-4 py-2 rounded"
					>
						Run Analysis
					</button>

					<StockCompareAnalysis analysis={analysis} />
				</>
			)}
		</div>
	)
}
