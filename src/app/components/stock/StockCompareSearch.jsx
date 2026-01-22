"use client"

import { useState } from "react"

export default function StockCompareSearch({ label, onSelect }) {
	const [symbol, setSymbol] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	async function handleSearch() {
		if (!symbol) return

		setLoading(true)
		setError(null)

		try {
			const res = await fetch(`/api/stock?symbol=${symbol.toUpperCase()}`)
			const data = await res.json()

			if (data.error) {
				setError(data.error)
				return
			}

			onSelect(data)
		} catch {
			setError("Failed to fetch stock")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex flex-col gap-1">
			<label className="text-sm text-gray-400">{label}</label>

			<div className="flex gap-2">
				<input
					value={symbol}
					onChange={e => setSymbol(e.target.value)}
					className="flex-1 bg-gray-800 p-2 rounded text-white"
					placeholder="AAPL"
				/>
				<button
					onClick={handleSearch}
					disabled={loading}
					className="bg-blue-600 px-3 rounded"
				>
					{loading ? "..." : "Search"}
				</button>
			</div>

			{error && <span className="text-xs text-red-400">{error}</span>}
		</div>
	)
}
