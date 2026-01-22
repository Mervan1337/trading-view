export default function StockCompareTable({ a, b }) {
	return (
		<table className="w-full text-sm border border-gray-700">
			<thead>
				<tr className="bg-gray-800">
					<th className="p-2 text-left">Metric</th>
					<th className="p-2 text-left">{a.symbol}</th>
					<th className="p-2 text-left">{b.symbol}</th>
				</tr>
			</thead>
			<tbody className="bg-gray-800">
				<tr><td>Price</td><td>${a.price}</td><td>${b.price}</td></tr>
				<tr><td>Market Cap</td><td>{a.marketCap}</td><td>{b.marketCap}</td></tr>
				<tr><td>PE Ratio</td><td>{a.peRatio}</td><td>{b.peRatio}</td></tr>
				<tr><td>EPS</td><td>{a.eps}</td><td>{b.eps}</td></tr>
				<tr><td>Beta</td><td>{a.beta}</td><td>{b.beta}</td></tr>
				<tr><td>Dividend Yield</td><td>{a.dividendYield ?? "-"}</td><td>{b.dividendYield ?? "-"}</td></tr>
				<tr><td>52W High</td><td>{a.week52High}</td><td>{b.week52High}</td></tr>
				<tr><td>52W Low</td><td>{a.week52Low}</td><td>{b.week52Low}</td></tr>
			</tbody>
		</table>
	)
}
