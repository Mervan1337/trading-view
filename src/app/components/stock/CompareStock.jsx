"use client"

import { useState } from "react"
import StockCompare from "./StockCompare"

export default function CompareStocks() {
	const [tickerA, setTickerA] = useState("")
	const [tickerB, setTickerB] = useState("")
	const [stockA, setStockA] = useState(null)
	const [stockB, setStockB] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	async function fetchStock(symbol, setter) {
		try {
			const res = await fetch(`/api/stock?symbol=${symbol}`)
			const data = await res.json()
			if (data.error) throw new Error(data.error)
			setter(data)
		} catch (err) {
			setError(`Failed to fetch ${symbol}: ${err.message}`)
			setter(null)
		}
	}

	async function handleCompare() {
		if (!tickerA || !tickerB) {
			setError("Please enter both tickers")
			return
		}

		setError("")
		setLoading(true)

		await Promise.all([
			fetchStock(tickerA.toUpperCase(), setStockA),
			fetchStock(tickerB.toUpperCase(), setStockB)
		])

		setLoading(false)
	}

	return (
		<div className="bg-gray-900 p-6 rounded-lg">
			<h2 className="text-xl font-bold mb-4 text-white">Stock Compare</h2>

			<div className="flex gap-4 mb-4">
				<input
					type="text"
					placeholder="Ticker A"
					className="px-3 py-2 rounded bg-gray-800 text-white flex-1"
					value={tickerA}
					onChange={(e) => setTickerA(e.target.value)}
				/>
				<input
					type="text"
					placeholder="Ticker B"
					className="px-3 py-2 rounded bg-gray-800 text-white flex-1"
					value={tickerB}
					onChange={(e) => setTickerB(e.target.value)}
				/>
				<button
					onClick={handleCompare}
					className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
				>
					Compare
				</button>
			</div>

			{error && <p className="text-red-400 mb-4">{error}</p>}
			{loading && <p className="text-gray-300 mb-4">Fetching stock data...</p>}

			{stockA && stockB && <StockCompare a={stockA} b={stockB} />}
		</div>
	)
}
