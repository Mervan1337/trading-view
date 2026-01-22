import MetricRow from "./MetricRow"
import ConfidenceBadge from "./ConfidenceBadge"
import { calculateConfidence } from "./utils/calculateConfidence"
import { compareToIndex } from "./utils/compareToIndex"
import { riskAdjustedScore } from "./utils/riskAdjustedScore"

export default function StockCompare({ a, b }) {
	const aConfidence = calculateConfidence(a)
	const bConfidence = calculateConfidence(b)

	return (
		<div className="bg-gray-900 p-6 rounded-lg mt-6">
			<div className="flex justify-between mb-4">
				<ConfidenceBadge score={aConfidence} label={a.symbol} />
				<ConfidenceBadge score={bConfidence} label={b.symbol} />
			</div>

			<table className="w-full text-sm border-collapse">
				<thead>
					<tr className="text-gray-400 border-b border-gray-700">
						<th className="px-2 py-1"></th>
						<th className="px-2 py-1">{a.symbol}</th>
						<th className="px-2 py-1">{b.symbol}</th>
					</tr>
				</thead>
				<tbody className="text-white">
					<MetricRow label="Price" aValue={a.price} bValue={b.price} />
					<MetricRow label="PE Ratio" aValue={a.peRatio} bValue={b.peRatio} higherIsBetter={false} />
					<MetricRow label="EPS" aValue={a.eps} bValue={b.eps} />
					<MetricRow label="Market Cap" aValue={a.marketCap} bValue={b.marketCap} />
					<MetricRow label="Dividend Yield" aValue={a.dividendYield} bValue={b.dividendYield} />
					<MetricRow label="Beta" aValue={a.beta} bValue={b.beta} higherIsBetter={false} />
					<MetricRow label="Momentum %" aValue={a.changePercent} bValue={b.changePercent} />
					<MetricRow label="Risk Adjusted Score" aValue={riskAdjustedScore(a)} bValue={riskAdjustedScore(b)} />
				</tbody>
			</table>

			<div className="mt-6 grid grid-cols-2 gap-4 text-xs text-gray-300">
				<div>
					<h4 className="font-semibold mb-1">{a.symbol} vs Index</h4>
					<ul>
						{compareToIndex(a).map((item, i) => (
							<li key={i}>• {item}</li>
						))}
					</ul>
				</div>
				<div>
					<h4 className="font-semibold mb-1">{b.symbol} vs Index</h4>
					<ul>
						{compareToIndex(b).map((item, i) => (
							<li key={i}>• {item}</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}
