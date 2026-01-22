export function analyzeStocks(a, b) {
	const analysis = []

	// Valuation
	if (a.peRatio && b.peRatio) {
		analysis.push(
			a.peRatio < b.peRatio
				? `${a.symbol} is cheaper based on PE ratio`
				: `${b.symbol} is cheaper based on PE ratio`
		)
	}

	// Growth efficiency
	if (a.eps && b.eps) {
		analysis.push(
			a.eps > b.eps
				? `${a.symbol} generates more earnings per share`
				: `${b.symbol} generates more earnings per share`
		)
	}

	// Risk
	if (a.beta && b.beta) {
		analysis.push(
			a.beta < b.beta
				? `${a.symbol} is less volatile`
				: `${b.symbol} is less volatile`
		)
	}

	// Income
	if (a.dividendYield || b.dividendYield) {
		analysis.push(
			(a.dividendYield ?? 0) > (b.dividendYield ?? 0)
				? `${a.symbol} offers better dividend yield`
				: `${b.symbol} offers better dividend yield`
		)
	}

	// Momentum
	if (a.changePercent && b.changePercent) {
		analysis.push(
			a.changePercent > b.changePercent
				? `${a.symbol} has stronger recent momentum`
				: `${b.symbol} has stronger recent momentum`
		)
	}

	// Market dominance
	if (a.marketCap && b.marketCap) {
		analysis.push(
			a.marketCap > b.marketCap
				? `${a.symbol} is the larger company by market cap`
				: `${b.symbol} is the larger company by market cap`
		)
	}

	return analysis
}
