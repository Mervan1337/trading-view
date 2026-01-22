export default function ConfidenceBadge({ score, label }) {
	const color = score >= 0.7 ? "bg-green-600" : score >= 0.4 ? "bg-yellow-600" : "bg-red-600"
	return (
		<div className={`px-3 py-1 rounded ${color} text-white text-xs font-semibold`}>
			{label}: {Math.round(score * 100)}% confidence
		</div>
	)
}
