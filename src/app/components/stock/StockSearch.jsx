"use client"

import { useState } from "react"
import InputField from "../ui/InputField"
import StockCard from "./StockCard"

export default function StockSearch() {
	const [symbol, setSymbol] = useState("")
	const [stock, setStock] = useState(null)
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	async function handleSearch() {
		setError("")
		setStock(null)

		if (!symbol.trim()) {
			setError("Enter a stock ticker, e.g. AAPL")
			return
		}

		setLoading(true)

		try {
			const res = await fetch(`/api/stock?symbol=${symbol.toUpperCase()}`)
			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error)
			}

			setStock(data)
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="space-y-4">
			<InputField
				label="Stock ticker"
				value={symbol}
				onChange={(e) => setSymbol(e.target.value)}
				placeholder="AAPL"
				tooltip="Enter the stock ticker symbol. US stocks work best."
				error={error}
			/>

			<button
				onClick={handleSearch}
				className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-500"
			>
				{loading ? "Loading..." : "Search"}
			</button>

			{stock && <StockCard stock={stock} />}
		</div>
	)
}
