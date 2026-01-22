export function calculateConfidence(stock) {
	let count = 0
	let total = 0

	const metrics = ["price", "peRatio", "eps", "marketCap", "beta", "changePercent"]
	metrics.forEach((m) => {
		total++
		if (stock[m] != null) count++
	})

	return count / total
}
