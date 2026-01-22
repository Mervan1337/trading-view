export default function StockCompareAnalysis({ analysis }) {
	if (!analysis.length) return null

	return (
		<div className="mt-4 bg-gray-800 p-4 rounded">
			<h3 className="font-semibold mb-2">Analysis</h3>
			{analysis.map((item, i) => (
				<p key={i} className="text-green-400">• {item}</p>
			))}
		</div>
	)
}
