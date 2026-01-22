export function riskAdjustedScore(stock) {
	if (stock.changePercent == null || stock.beta == null || stock.beta === 0) return null
	return (stock.changePercent / stock.beta).toFixed(2)
}
