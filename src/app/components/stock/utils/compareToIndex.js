export function compareToIndex(stock) {
	const baseline = {
		price: 100,
		peRatio: 25,
		eps: 2,
		marketCap: 1e9,
		beta: 1
	}

	const comparisons = []

	if (stock.price != null) comparisons.push(`Price vs baseline: ${stock.price > baseline.price ? "Higher" : "Lower"}`)
	if (stock.peRatio != null) comparisons.push(`PE Ratio vs baseline: ${stock.peRatio < baseline.peRatio ? "Better" : "Worse"}`)
	if (stock.eps != null) comparisons.push(`EPS vs baseline: ${stock.eps > baseline.eps ? "Higher" : "Lower"}`)
	if (stock.marketCap != null) comparisons.push(`Market Cap vs baseline: ${stock.marketCap > baseline.marketCap ? "Higher" : "Lower"}`)
	if (stock.beta != null) comparisons.push(`Beta vs baseline: ${stock.beta < baseline.beta ? "Lower (less risky)" : "Higher (more volatile)"}`)

	return comparisons
}
