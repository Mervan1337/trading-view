export default function KellyResult({ value }) {
	return (
		<div className="mt-4 p-4 bg-gray-100 rounded">
			Recommended bankroll fraction:
			<div className="text-xl font-bold">
				{(value * 100).toFixed(2)} %
			</div>
		</div>
	)
}
