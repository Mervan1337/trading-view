export function runMonteCarlo({ meanDailyReturn, dailyVolatility, horizonDays, iterations, initialValue, seed = null }) {
	let rng = seed !== null ? mulberry32(seed) : Math.random;

	function randomNormal() {
		let u = 0, v = 0;
		while (u === 0) u = rng();
		while (v === 0) v = rng();
		return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	}

	const paths = [];

	for (let i = 0; i < iterations; i++) {
		const path = [initialValue];
		for (let t = 0; t < horizonDays; t++) {
			const shock = randomNormal() * dailyVolatility + meanDailyReturn;
			path.push(path[path.length - 1] * Math.exp(shock));
		}
		paths.push(path);
	}

	// Compute summary statistics at the end
	const finalValues = paths.map(p => p[p.length - 1]);
	finalValues.sort((a, b) => a - b);
	const median = finalValues[Math.floor(finalValues.length / 2)];
	const p5 = finalValues[Math.floor(finalValues.length * 0.05)];
	const p95 = finalValues[Math.floor(finalValues.length * 0.95)];
	const probLoss = finalValues.filter(v => v < initialValue).length / finalValues.length;
	const probGain = finalValues.filter(v => v > initialValue).length / finalValues.length;

	// Compute daily percentiles for chart
	const dailyPercentiles = [];
	for (let t = 0; t <= horizonDays; t++) {
		const dayValues = paths.map(p => p[t]).sort((a, b) => a - b);
		const medianDay = dayValues[Math.floor(dayValues.length / 2)];
		const p5Day = dayValues[Math.floor(dayValues.length * 0.05)];
		const p95Day = dayValues[Math.floor(dayValues.length * 0.95)];
		dailyPercentiles.push({ day: t, p5: p5Day, median: medianDay, p95: p95Day });
	}

	return { paths, finalValues, summary: { median, p5, p95, probLoss, probGain }, dailyPercentiles };
}

// Seeded RNG
function mulberry32(a) {
	return function() {
		let t = a += 0x6D2B79F5;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
