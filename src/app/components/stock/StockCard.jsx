"use client"

import { useEffect, useState } from "react"
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip as ChartTooltip,
	ResponsiveContainer
} from "recharts"

export default function StockCard({ stock }) {
	const changePercentNum = Number(stock.changePercent)
	const positive = changePercentNum >= 0
	const [chartData, setChartData] = useState([])

	useEffect(() => {
		async function fetchChart() {
			const res = await fetch(`/api/chart?symbol=${stock.symbol}&interval=1day`)
			const data = await res.json()
			if (data.values) {
				setChartData(
					data.values
						.map(item => ({
							date: item.datetime,
							close: parseFloat(item.close)
						}))
						.reverse() // oldest first
				)
			}
		}
		fetchChart()
	}, [stock.symbol])

	return (
		<div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
			{/* Header with logo */}
			<div className="flex items-center gap-3 mb-2">
				{stock.logo && (
					<img
						src={stock.logo}
						alt={`${stock.name} logo`}
						className="w-10 h-10 object-contain rounded"
					/>
				)}
				<h2 className="text-lg font-semibold text-white">
					{stock.name} ({stock.symbol})
				</h2>
			</div>
			<p className="text-sm text-gray-400">
				{stock.exchange} · {stock.industry}
			</p>

			{/* Stock Details Table */}
			<div className="bg-gray-900 text-white p-6 rounded shadow-lg overflow-x-auto mb-6">
				<h2 className="text-xl font-bold mb-4">{stock.name} ({stock.symbol})</h2>
				<table className="table-auto w-full text-sm">
					<tbody>
						<tr><td className="font-semibold">Name</td><td>{stock.name}</td></tr>
						<tr><td className="font-semibold">Symbol</td><td>{stock.symbol}</td></tr>
						<tr><td className="font-semibold">Exchange</td><td>{stock.exchange}</td></tr>
						<tr><td className="font-semibold">Industry</td><td>{stock.industry}</td></tr>
						<tr><td className="font-semibold">Country</td><td>{stock.country}</td></tr>
						<tr><td className="font-semibold">CEO</td><td>{stock.ceo}</td></tr>
						<tr><td className="font-semibold">Website</td><td><a className="text-blue-400" href={stock.website} target="_blank">{stock.website}</a></td></tr>
						<tr><td className="font-semibold">Price</td><td>${stock.price}</td></tr>
						<tr><td className="font-semibold">Change</td><td className={positive ? "text-green-400" : "text-red-400"}>{!isNaN(changePercentNum) ? changePercentNum.toFixed(2) + '%' : '-'}</td></tr>
						<tr><td className="font-semibold">Open</td><td>${stock.open}</td></tr>
						<tr><td className="font-semibold">High</td><td>${stock.high}</td></tr>
						<tr><td className="font-semibold">Low</td><td>${stock.low}</td></tr>
						<tr><td className="font-semibold">Previous Close</td><td>${stock.prevClose}</td></tr>
						<tr><td className="font-semibold">52 Week High</td><td>${stock.week52High}</td></tr>
						<tr><td className="font-semibold">52 Week Low</td><td>${stock.week52Low}</td></tr>
						<tr><td className="font-semibold">Market Cap</td><td>${stock.marketCap?.toLocaleString() || '-'}</td></tr>
						<tr><td className="font-semibold">PE Ratio</td><td>{stock.peRatio ?? '-'}</td></tr>
						<tr><td className="font-semibold">EPS</td><td>{stock.eps ?? '-'}</td></tr>
						<tr><td className="font-semibold">Dividend Yield</td><td>{stock.dividendYield ?? '-'}</td></tr>
						<tr><td className="font-semibold">Beta</td><td>{stock.beta ?? '-'}</td></tr>
						<tr><td className="font-semibold">Price Target</td><td>{stock.priceTarget ?? '-'}</td></tr>
					</tbody>
				</table>
			</div>

			{/* Stock Chart */}
			<div className="bg-gray-900 p-4 rounded shadow-lg text-white h-80">
				<h3 className="text-lg font-bold mb-2">Price Chart</h3>
				{chartData.length ? (
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={chartData}>
							<XAxis dataKey="date" tick={{ fill: 'white', fontSize: 10 }} />
							<YAxis tick={{ fill: 'white', fontSize: 10 }} domain={['auto', 'auto']} />
							<ChartTooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: 'white' }} />
							<Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} dot={false} />
						</LineChart>
					</ResponsiveContainer>
				) : (
					<p>No chart data available</p>
				)}
			</div>
		</div>
	)
}
