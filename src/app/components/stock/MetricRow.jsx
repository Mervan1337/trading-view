export default function MetricRow({ label, aValue, bValue, higherIsBetter = true }) {
	function getClass(a, b, isA) {
		if (a == null || b == null) return ""
		if (a === b) return ""
		const aWins = higherIsBetter ? a > b : a < b
		return isA === aWins ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
	}

	return (
		<tr className="border-t border-gray-800">
			<td className="font-semibold py-2 px-2">{label}</td>
			<td className={`px-2 ${getClass(aValue, bValue, true)}`}>{aValue ?? "-"}</td>
			<td className={`px-2 ${getClass(aValue, bValue, false)}`}>{bValue ?? "-"}</td>
		</tr>
	)
}
