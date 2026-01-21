export default function StockCard({ stock }) {
	const changePercentNum = Number(stock.changePercent)
	const positive = changePercentNum >= 0

	return (
		<div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
			<h2 className="text-lg font-semibold text-white">
				{stock.name} ({stock.symbol})
			</h2>

			<p className="text-sm text-gray-400">
				{stock.exchange} · {stock.industry}
			</p>

			<div className="bg-gray-900 text-white p-6 rounded shadow-lg overflow-x-auto">
				<h2 className="text-xl font-bold mb-4">{stock.name} ({stock.symbol})</h2>
				<table className="table-auto w-full text-sm">
					<tbody>
						<tr><td className="font-semibold">Exchange</td><td>{stock.exchange}</td></tr>
						<tr><td className="font-semibold">Industry</td><td>{stock.industry}</td></tr>
						<tr><td className="font-semibold">CEO</td><td>{stock.ceo}</td></tr>
						<tr><td className="font-semibold">Website</td><td><a className="text-blue-400" href={stock.website} target="_blank">{stock.website}</a></td></tr>
						<tr><td className="font-semibold">Price</td><td>${stock.price}</td></tr>
						<tr><td className="font-semibold">Change</td><td className={positive ? "text-green-400" : "text-red-400"}>{!isNaN(changePercentNum) ? changePercentNum.toFixed(2) + '%' : '-'}</td></tr>
						<tr><td className="font-semibold">52 Week High</td><td>${stock.week52High}</td></tr>
						<tr><td className="font-semibold">52 Week Low</td><td>${stock.week52Low}</td></tr>
						<tr><td className="font-semibold">Market Cap</td><td>${stock.marketCap?.toLocaleString()}</td></tr>
						<tr><td className="font-semibold">PE Ratio</td><td>{stock.peRatio}</td></tr>
						<tr><td className="font-semibold">EPS</td><td>{stock.eps}</td></tr>
						<tr><td className="font-semibold">Dividend Yield</td><td>{stock.dividendYield}%</td></tr>
						<tr><td className="font-semibold">Beta</td><td>{stock.beta}</td></tr>
						<tr><td className="font-semibold">Price Target</td><td>${stock.priceTarget}</td></tr>
					</tbody>
				</table>
			</div>
		</div>
	)
}
